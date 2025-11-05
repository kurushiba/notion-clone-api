import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Note } from './note.entity';
import { Auth } from '../../lib/auth';

const noteController = Router();
const noteRepository = datasource.getRepository(Note);

// ノート作成
noteController.post('/', Auth, async (req: Request, res: Response) => {
  try {
    const { title, content, parentId } = req.body;
    const userId = req.currentUser!.id;

    // parentId が指定されている場合、存在確認と所有者チェック
    if (parentId != null) {
      const parentNote = await noteRepository.findOne({
        where: { id: parentId, userId },
      });
      if (!parentNote) {
        res.status(404).json({ message: '親ノートが見つかりません' });
        return;
      }
    }

    // ノート作成
    const note = await noteRepository.save({
      userId,
      title: title || null,
      content: content || null,
      parentId: parentId || null,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('ノート作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default noteController;

