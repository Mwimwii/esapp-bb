import { Comment, User, Agreement } from 'app/models';

export class CommentService {
  async add(agreement: Agreement, user: User, comments?: string) {
    if (!comments) {
      return;
    }

    const comment = new Comment();
    comment.comment = comments;
    comment.agreement = agreement;
    comment.createdBy = user;

    await comment.save()
  }
}
