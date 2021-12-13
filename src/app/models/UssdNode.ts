import { PropertyNameLiteral } from 'typescript';
import { UssdNodeType } from "../enums/UssdNodeType";
import { UssdRequest } from './UssdRequest';

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
  constructor(title: string, type: UssdNodeType, branches: UssdNode[], prompt?: string, callback?: any);
  constructor(title: string, type: UssdNodeType, branches: UssdNode[], prompt?: string, callback?: any) {
    this.title = convertToLabel(title) || '';
    this.branches = branches;
    // this.datalist = datalist || [];
    this.type = type;
    this.prompt = prompt ? convertToLabel(prompt) : prompt;
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
            text += `${index + 1}. ${convertToLabel(this.branches[index].title)}\n`;
          }
        }
        break;
      case UssdNodeType.detail:
        if (this.datalist[0]) {
          text = 'CON ' + (this.datalist[0].title) + '\n';
          for (const key in this.datalist[0]) {
            if (!['id', 'title'].includes(key.toLocaleLowerCase()))
              text += `${key}: ${this.datalist[0][key]}\n`;
          }
        }

        if (this.branches.length > 0) {
          for (let index = 0; index < this.branches.length; index++) {
            text += `${index + 1}. ${convertToLabel(this.branches[index].title)}\n`;
          }
        }
        break;
      case UssdNodeType.nav:
        if (this.branches.length > 0) {
          for (let index = 0; index < this.branches.length; index++) {
            text += `${index + 1}. ${convertToLabel(this.branches[index].title)}\n`;
          }
        }
        break;
      case UssdNodeType.end:
        text = 'END ' + this.prompt || this.title;
        break;
      default:

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

  executeCalldata(request: UssdRequest, nextSequenceVal: string | undefined) {
    this.datalist = this.callback(request, nextSequenceVal);
  }

  executeCallback(request: UssdRequest, nextSequenceVal: string | undefined): UssdNode {
    this.callback(request, nextSequenceVal);
    return this.getNext(1);
  }
}

function toPascalCase(text: string) {
  if (text) {
    text = text.toLowerCase();
    // let words = text.split(' ') || [];
    // words.forEach(word => {
    //   out += word[0].toUpperCase() + word.substr(1) + ' ';
    // });
  }
  return text.trim();
}

function convertToLabel(text: string) {
  if (!text) return;
  text = toPascalCase(text.replace(/[^a-zA-Z0-9.]/g, ' '));
  return text;
}