import { PropertyNameLiteral } from 'typescript';
import { UssdNodeType } from '../controllers/api/ussd.controller';

export class UssdNode {

  /**
   *
   * @param title
   * @param type
   * @param branches
   * @param datalist
   */
  constructor(title: string, type: UssdNodeType, branches: UssdNode[]);
  constructor(title: string, type: UssdNodeType, branches: UssdNode[], prompt?: string);
  constructor(title: string, type: UssdNodeType, branches: UssdNode[], prompt?: string, datalist?: any[]);
  constructor(title: string, type: UssdNodeType, branches: UssdNode[], prompt?: string, datalist?: any[], callback?: any);
  constructor(title: string, type: UssdNodeType, branches: UssdNode[], prompt?: string, datalist?: any[], callback?: any) {
    this.title = title;
    this.branches = branches;
    this.datalist = datalist || [];
    this.type = type;
    this.prompt = prompt;
    this.callback = callback;
  }
  title: string;
  prompt?: string;
  string: PropertyNameLiteral;
  branches: UssdNode[];
  type: UssdNodeType;
  datalist: any[];
  callback: any;
  execute = (): string => {
    let text = 'CON ' + (this.prompt || this.title) + '\n';
    switch (this.type) {
      case UssdNodeType.list:
        if (this.branches.length != this.datalist.length) {
          let options = this.buildListNodes();
          if (options.length > 0) {
            for (let index = 0; index < options.length; index++) {
              text += `${index + 1}. ${options[index].title}\n`;
            }
          }
          this.branches = options;
        } else {
          for (let index = 0; index < this.branches.length; index++) {
            text += `${index + 1}. ${this.branches[index].title}\n`;
          }
        }
        break;
      case UssdNodeType.detail:
        if (this.datalist[0]) {
          text = 'CON ' + (this.datalist[0].title) + '\n\n';
          for (const key in this.datalist[0]) {
            if (!['id', 'title'].includes(key.toLocaleLowerCase()))
              text += `${key.toLocaleUpperCase().replace('_', ' ')}: ${this.datalist[0][key]}\n`;
          }
        }

        if (this.branches.length > 0) {
          for (let index = 0; index < this.branches.length; index++) {
            text += `${index + 1}. ${this.branches[index].title}\n`;
          }
        }
        break;
      case UssdNodeType.nav:
        if (this.branches.length > 0) {
          for (let index = 0; index < this.branches.length; index++) {
            text += `${index + 1}. ${this.branches[index].title}\n`;
          }
        }
        break;
      case UssdNodeType.prompt:
        text = 'END ' + this.prompt || this.title + this.callback;
        break;
      case UssdNodeType.end:
      default:
        text = 'END ' + this.prompt || this.title;
        break;
    }
    return text;
  };

  buildListNodes = (): UssdNode[] => {
    const result = Array<UssdNode>();
    for (const listItem of this.datalist) {
      result.push(
        new UssdNode(listItem.title, UssdNodeType.detail, this.branches, this.prompt, [listItem])
      );
    }
    return result;
  };

  getNext = (sequenceid: number): UssdNode => {
    if (sequenceid > 0) {
      return this.branches[sequenceid - 1];
    }
    return this;
  };
}
