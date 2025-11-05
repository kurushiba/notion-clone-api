import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Note } from './note.entity';
import { Auth } from '../../lib/auth';
import { IsNull } from 'typeorm';

const noteController = Router();
const noteRepository = datasource.getRepository(Note);

// ノート一覧取得
noteController.get('/', Auth, async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser!.id;
    const parentIdParam = req.query.parentId as string | undefined;

    let notes;
    if (parentIdParam !== undefined) {
      // クエリパラメータで parentId が指定された場合
      const parentId = parseInt(parentIdParam);
      notes = await noteRepository.find({
        where: { userId, parentId },
        order: { createdAt: 'DESC' },
      });
    } else {
      // parentId 未指定の場合はルートノート（parentId = null）のみ
      notes = await noteRepository.find({
        where: { userId, parentId: IsNull() },
        order: { createdAt: 'DESC' },
      });
    }

    res.status(200).json({ notes });
  } catch (error) {
    console.error('ノート一覧取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ノート詳細取得
noteController.get('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser!.id;
    const noteId = parseInt(req.params.id);

    const note = await noteRepository.findOne({
      where: { id: noteId, userId },
    });

    if (!note) {
      res.status(404).json({ message: 'ノートが見つかりません' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('ノート取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

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

