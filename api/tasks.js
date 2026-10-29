// في الذاكرة لأغراض التجربة (في الإنتاج استخدم قاعدة بيانات)
let tasks = [];

export default function handler(req, res) {
  // تعيين CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET - جلب جميع المهام
  if (req.method === 'GET') {
    return res.status(200).json(tasks);
  }

  // POST - إضافة مهمة جديدة
  if (req.method === 'POST') {
    const task = req.body;
    task.id = Date.now().toString();
    task.createdAt = new Date().toISOString();
    tasks.push(task);
    return res.status(201).json(task);
  }

  // DELETE - حذف مهمة
  if (req.method === 'DELETE') {
    const id = req.query.id;
    tasks = tasks.filter(t => t.id !== id);
    return res.status(200).json({ success: true });
  }

  // PUT - تحديث جميع المهام
  if (req.method === 'PUT') {
    tasks = req.body;
    return res.status(200).json(tasks);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
