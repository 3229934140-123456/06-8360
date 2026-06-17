import type {
  Teacher,
  Student,
  Parent,
  Class,
  StudentInClass,
  Assignment,
  Submission,
  Notification,
  Question,
  Annotation,
  Statistics,
  StudentAssignmentStats
} from '@/types';

// 教师数据
export const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: '王明老师',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1',
    email: 'wangming@school.com',
    subject: '数学'
  },
  {
    id: 't2',
    name: '李华老师',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2',
    email: 'lihua@school.com',
    subject: '语文'
  }
];

// 学生数据
export const mockStudents: Student[] = [
  {
    id: 's1',
    name: '张三',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    studentNo: '2024001',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's2',
    name: '李四',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    studentNo: '2024002',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's3',
    name: '王五',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    studentNo: '2024003',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's4',
    name: '赵六',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    studentNo: '2024004',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's5',
    name: '孙七',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student5',
    studentNo: '2024005',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's6',
    name: '周八',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student6',
    studentNo: '2024006',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's7',
    name: '吴九',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student7',
    studentNo: '2024007',
    classId: 'c1',
    className: '三年级一班'
  },
  {
    id: 's8',
    name: '郑十',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student8',
    studentNo: '2024008',
    classId: 'c1',
    className: '三年级一班'
  }
];

// 家长数据
export const mockParents: Parent[] = [
  {
    id: 'p1',
    name: '张爸爸',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent1',
    phone: '13800138001',
    childIds: ['s1']
  },
  {
    id: 'p2',
    name: '李妈妈',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent2',
    phone: '13800138002',
    childIds: ['s2']
  }
];

// 班级数据
export const mockClasses: Class[] = [
  {
    id: 'c1',
    name: '三年级一班',
    teacherId: 't1',
    teacherName: '王明老师',
    inviteCode: 'ABC123',
    studentCount: 8,
    grade: '三年级',
    createdAt: '2024-09-01'
  },
  {
    id: 'c2',
    name: '三年级二班',
    teacherId: 't1',
    teacherName: '王明老师',
    inviteCode: 'DEF456',
    studentCount: 6,
    grade: '三年级',
    createdAt: '2024-09-01'
  },
  {
    id: 'c3',
    name: '四年级一班',
    teacherId: 't2',
    teacherName: '李华老师',
    inviteCode: 'GHI789',
    studentCount: 10,
    grade: '四年级',
    createdAt: '2024-09-01'
  }
];

// 班级学生列表
export const mockClassStudents: Record<string, StudentInClass[]> = {
  c1: mockStudents.map(s => ({
    id: s.id,
    name: s.name,
    studentNo: s.studentNo,
    avatar: s.avatar,
    joinDate: '2024-09-01'
  }))
};

// 题目数据
const mathQuestions: Question[] = [
  {
    id: 'q1',
    type: 'choice',
    content: '下列哪个数是质数？',
    score: 10,
    options: ['4', '6', '7', '9'],
    correctAnswer: '7',
    knowledgePoint: '质数与合数'
  },
  {
    id: 'q2',
    type: 'choice',
    content: '一个长方形的长是8厘米，宽是5厘米，它的周长是多少厘米？',
    score: 10,
    options: ['13厘米', '26厘米', '40厘米', '36厘米'],
    correctAnswer: '26厘米',
    knowledgePoint: '长方形周长'
  },
  {
    id: 'q3',
    type: 'fill_blank',
    content: '36的平方根是______',
    score: 10,
    correctAnswer: '6',
    knowledgePoint: '平方根'
  },
  {
    id: 'q4',
    type: 'short_answer',
    content: '请用简便方法计算：25×17×4',
    score: 15,
    correctAnswer: '1700',
    knowledgePoint: '乘法运算律'
  },
  {
    id: 'q5',
    type: 'essay',
    content: '请描述一下你在生活中遇到的数学问题，并说明你是如何解决的。',
    score: 15,
    knowledgePoint: '数学应用'
  }
];

const chineseQuestions: Question[] = [
  {
    id: 'qc1',
    type: 'fill_blank',
    content: '床前明月光，______。',
    score: 10,
    correctAnswer: '疑是地上霜',
    knowledgePoint: '古诗背诵'
  },
  {
    id: 'qc2',
    type: 'choice',
    content: '下列词语中，没有错别字的一组是？',
    score: 10,
    options: ['按步就班', '川流不息', '一愁莫展', '走头无路'],
    correctAnswer: '川流不息',
    knowledgePoint: '错别字辨析'
  },
  {
    id: 'qc3',
    type: 'essay',
    content: '请以"我的课余生活"为题，写一篇300字左右的短文。',
    score: 30,
    knowledgePoint: '写作'
  }
];

// 作业数据
export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: '第三章 因数与倍数 课后练习',
    description: '完成课本第25-27页的练习题，重点掌握质数、合数的概念以及因数分解的方法。',
    classId: 'c1',
    className: '三年级一班',
    teacherId: 't1',
    dueDate: '2024-12-20T23:59:00',
    createdAt: '2024-12-15T10:00:00',
    status: 'published',
    totalScore: 60,
    subject: '数学',
    referenceMaterials: [
      {
        id: 'rm1',
        name: '第三章知识点总结.pdf',
        url: '#',
        type: 'pdf',
        size: '2.5MB'
      },
      {
        id: 'rm2',
        name: '例题讲解视频',
        url: '#',
        type: 'link'
      }
    ],
    questions: mathQuestions,
    submissionCount: 6,
    totalStudents: 8
  },
  {
    id: 'a2',
    title: '长方形和正方形周长 专项练习',
    description: '完成周长计算专项练习卷，要求写出计算过程。拍照上传手写答案。',
    classId: 'c1',
    className: '三年级一班',
    teacherId: 't1',
    dueDate: '2024-12-22T23:59:00',
    createdAt: '2024-12-18T09:00:00',
    status: 'published',
    totalScore: 100,
    subject: '数学',
    referenceMaterials: [
      {
        id: 'rm3',
        name: '周长公式大全.png',
        url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        type: 'image',
        size: '800KB'
      }
    ],
    questions: [],
    submissionCount: 4,
    totalStudents: 8
  },
  {
    id: 'a3',
    title: '静夜思 背诵与默写',
    description: '背诵并默写古诗《静夜思》，要求字迹工整，注意易错字。',
    classId: 'c1',
    className: '三年级一班',
    teacherId: 't2',
    dueDate: '2024-12-19T23:59:00',
    createdAt: '2024-12-16T14:00:00',
    status: 'published',
    totalScore: 50,
    subject: '语文',
    referenceMaterials: [],
    questions: chineseQuestions,
    submissionCount: 8,
    totalStudents: 8
  },
  {
    id: 'a4',
    title: '期末复习综合练习（一）',
    description: '综合练习卷，覆盖本学期所有知识点。请认真完成，下周讲解。',
    classId: 'c1',
    className: '三年级一班',
    teacherId: 't1',
    dueDate: '2024-12-25T23:59:00',
    createdAt: '2024-12-20T08:00:00',
    status: 'published',
    totalScore: 100,
    subject: '数学',
    referenceMaterials: [],
    questions: [],
    submissionCount: 2,
    totalStudents: 8
  },
  {
    id: 'a5',
    title: '乘法运算律 预习作业',
    description: '预习下一章内容，尝试完成课后习题第1-5题。',
    classId: 'c1',
    className: '三年级一班',
    teacherId: 't1',
    dueDate: '2024-12-10T23:59:00',
    createdAt: '2024-12-05T10:00:00',
    status: 'closed',
    totalScore: 50,
    subject: '数学',
    referenceMaterials: [],
    questions: [],
    submissionCount: 8,
    totalStudents: 8
  }
];

// 手写作业示例图片
const sampleHandwritingImage = 'https://images.unsplash.com/photo-1453733190371-0a9bedd82893?w=800';
const sampleHandwritingImage2 = 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800';

// 生成标注数据
const generateAnnotations = (score: number): Annotation[] => {
  if (score >= 90) {
    return [
      {
        id: 'ann1',
        type: 'text',
        pageIndex: 0,
        color: '#10B981',
        x: 100,
        y: 80,
        text: '很棒！'
      },
      {
        id: 'ann2',
        type: 'pen',
        pageIndex: 0,
        color: '#EF4444',
        strokeWidth: 3,
        points: [
          { x: 150, y: 200 }, { x: 180, y: 220 }, { x: 200, y: 190 },
          { x: 220, y: 230 }, { x: 250, y: 210 }
        ]
      }
    ];
  } else if (score >= 70) {
    return [
      {
        id: 'ann1',
        type: 'rect',
        pageIndex: 0,
        color: '#F59E0B',
        x: 120,
        y: 150,
        width: 80,
        height: 30
      },
      {
        id: 'ann2',
        type: 'text',
        pageIndex: 0,
        color: '#F59E0B',
        x: 120,
        y: 190,
        text: '这里再检查一下'
      },
      {
        id: 'ann3',
        type: 'highlight',
        pageIndex: 0,
        color: 'rgba(251, 191, 36, 0.3)',
        x: 80,
        y: 250,
        width: 200,
        height: 25
      }
    ];
  } else {
    return [
      {
        id: 'ann1',
        type: 'rect',
        pageIndex: 0,
        color: '#EF4444',
        x: 100,
        y: 120,
        width: 100,
        height: 35
      },
      {
        id: 'ann2',
        type: 'text',
        pageIndex: 0,
        color: '#EF4444',
        x: 100,
        y: 170,
        text: '计算错误'
      },
      {
        id: 'ann3',
        type: 'rect',
        pageIndex: 0,
        color: '#EF4444',
        x: 90,
        y: 220,
        width: 120,
        height: 35
      },
      {
        id: 'ann4',
        type: 'text',
        pageIndex: 0,
        color: '#F59E0B',
        x: 120,
        y: 270,
        text: '公式记错了'
      }
    ];
  }
};

// 提交数据
export const mockSubmissions: Submission[] = [
  {
    id: 'sub1',
    assignmentId: 'a1',
    assignmentTitle: '第三章 因数与倍数 课后练习',
    studentId: 's1',
    studentName: '张三',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    studentNo: '2024001',
    images: [sampleHandwritingImage],
    answers: [
      { questionId: 'q1', answer: '7', isCorrect: true, score: 10 },
      { questionId: 'q2', answer: '26厘米', isCorrect: true, score: 10 },
      { questionId: 'q3', answer: '6', isCorrect: true, score: 10 },
      { questionId: 'q4', answer: '25×4×17=100×17=1700', isCorrect: true, score: 15 },
      { questionId: 'q5', answer: '今天妈妈买了12个苹果，我们家有3个人，每人可以吃几个？我用12÷3=4，每人可以吃4个。', isCorrect: true, score: 13 }
    ],
    submittedAt: '2024-12-18T15:30:00',
    status: 'graded',
    score: 58,
    comment: '完成得很好！概念掌握扎实，继续保持！注意第五题可以再展开一些。',
    gradedAt: '2024-12-19T10:00:00',
    gradedBy: '王明老师',
    annotations: generateAnnotations(95),
    isLate: false
  },
  {
    id: 'sub2',
    assignmentId: 'a1',
    assignmentTitle: '第三章 因数与倍数 课后练习',
    studentId: 's2',
    studentName: '李四',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    studentNo: '2024002',
    images: [sampleHandwritingImage2],
    answers: [
      { questionId: 'q1', answer: '6', isCorrect: false, score: 0 },
      { questionId: 'q2', answer: '40厘米', isCorrect: false, score: 0 },
      { questionId: 'q3', answer: '5', isCorrect: false, score: 0 },
      { questionId: 'q4', answer: '25×17=425', isCorrect: false, score: 5 },
      { questionId: 'q5', answer: '数学很有趣。', isCorrect: false, score: 8 }
    ],
    submittedAt: '2024-12-18T20:00:00',
    status: 'graded',
    score: 13,
    comment: '这章内容掌握得不够好，需要多加练习。有不懂的地方及时来问老师。',
    gradedAt: '2024-12-19T11:30:00',
    gradedBy: '王明老师',
    annotations: generateAnnotations(22),
    isLate: false
  },
  {
    id: 'sub3',
    assignmentId: 'a1',
    assignmentTitle: '第三章 因数与倍数 课后练习',
    studentId: 's3',
    studentName: '王五',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    studentNo: '2024003',
    images: [],
    answers: [
      { questionId: 'q1', answer: '7', isCorrect: true, score: 10 },
      { questionId: 'q2', answer: '26厘米', isCorrect: true, score: 10 },
      { questionId: 'q3', answer: '6', isCorrect: true, score: 10 },
      { questionId: 'q4', answer: '', isCorrect: false, score: 0 },
      { questionId: 'q5', answer: '', isCorrect: false, score: 0 }
    ],
    submittedAt: '2024-12-19T09:00:00',
    status: 'submitted',
    score: null,
    comment: '',
    gradedAt: null,
    annotations: [],
    isLate: false
  },
  {
    id: 'sub4',
    assignmentId: 'a1',
    assignmentTitle: '第三章 因数与倍数 课后练习',
    studentId: 's4',
    studentName: '赵六',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    studentNo: '2024004',
    images: [sampleHandwritingImage],
    answers: [
      { questionId: 'q1', answer: '7', isCorrect: true, score: 10 },
      { questionId: 'q2', answer: '26厘米', isCorrect: true, score: 10 },
      { questionId: 'q3', answer: '6', isCorrect: true, score: 10 },
      { questionId: 'q4', answer: '25×17×4=25×4×17=1700', isCorrect: true, score: 15 },
      { questionId: 'q5', answer: '上次和爸妈去超市，苹果5元一斤，买了3斤，一共花了5×3=15元。', isCorrect: true, score: 14 }
    ],
    submittedAt: '2024-12-19T12:00:00',
    status: 'graded',
    score: 59,
    comment: '非常棒！思路清晰，计算题做得很对。作文举的例子很好，继续保持！',
    gradedAt: '2024-12-19T14:00:00',
    gradedBy: '王明老师',
    annotations: generateAnnotations(98),
    isLate: true
  },
  {
    id: 'sub5',
    assignmentId: 'a1',
    assignmentTitle: '第三章 因数与倍数 课后练习',
    studentId: 's5',
    studentName: '孙七',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student5',
    studentNo: '2024005',
    images: [],
    answers: [],
    submittedAt: '2024-12-19T16:00:00',
    status: 'submitted',
    score: null,
    comment: '',
    gradedAt: null,
    annotations: [],
    isLate: true
  },
  {
    id: 'sub6',
    assignmentId: 'a1',
    assignmentTitle: '第三章 因数与倍数 课后练习',
    studentId: 's6',
    studentName: '周八',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student6',
    studentNo: '2024006',
    images: [sampleHandwritingImage2],
    answers: [],
    submittedAt: '2024-12-18T18:00:00',
    status: 'submitted',
    score: null,
    comment: '',
    gradedAt: null,
    annotations: [],
    isLate: false
  },
  {
    id: 'sub7',
    assignmentId: 'a2',
    assignmentTitle: '长方形和正方形周长 专项练习',
    studentId: 's1',
    studentName: '张三',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    studentNo: '2024001',
    images: [sampleHandwritingImage, sampleHandwritingImage2],
    answers: [],
    submittedAt: '2024-12-20T10:00:00',
    status: 'graded',
    score: 85,
    comment: '整体不错，第三题计算时粗心了，注意检查。',
    gradedAt: '2024-12-21T09:00:00',
    gradedBy: '王明老师',
    annotations: generateAnnotations(85),
    isLate: false
  },
  {
    id: 'sub8',
    assignmentId: 'a2',
    assignmentTitle: '长方形和正方形周长 专项练习',
    studentId: 's2',
    studentName: '李四',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    studentNo: '2024002',
    images: [sampleHandwritingImage],
    answers: [],
    submittedAt: '2024-12-20T15:00:00',
    status: 'submitted',
    score: null,
    comment: '',
    gradedAt: null,
    annotations: [],
    isLate: false
  },
  {
    id: 'sub9',
    assignmentId: 'a2',
    assignmentTitle: '长方形和正方形周长 专项练习',
    studentId: 's3',
    studentName: '王五',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    studentNo: '2024003',
    images: [],
    answers: [],
    submittedAt: '2024-12-21T08:00:00',
    status: 'submitted',
    score: null,
    comment: '',
    gradedAt: null,
    annotations: [],
    isLate: true
  },
  {
    id: 'sub10',
    assignmentId: 'a2',
    assignmentTitle: '长方形和正方形周长 专项练习',
    studentId: 's4',
    studentName: '赵六',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    studentNo: '2024004',
    images: [sampleHandwritingImage2],
    answers: [],
    submittedAt: '2024-12-19T20:00:00',
    status: 'graded',
    score: 92,
    comment: '做得很好！全部正确，字迹工整。',
    gradedAt: '2024-12-20T10:00:00',
    gradedBy: '王明老师',
    annotations: generateAnnotations(92),
    isLate: false
  },
  {
    id: 'sub11',
    assignmentId: 'a3',
    assignmentTitle: '静夜思 背诵与默写',
    studentId: 's1',
    studentName: '张三',
    studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    studentNo: '2024001',
    images: [],
    answers: [
      { questionId: 'qc1', answer: '疑是地上霜', isCorrect: true, score: 10 },
      { questionId: 'qc2', answer: '川流不息', isCorrect: true, score: 10 },
      { questionId: 'qc3', answer: '我的课余生活丰富多彩。我喜欢看书、画画、踢球。每天放学后，我都会先完成作业，然后看一会儿课外书。周末的时候，我会和朋友们一起去公园踢球。我觉得课余生活让我很快乐。', isCorrect: true, score: 27 }
    ],
    submittedAt: '2024-12-18T19:00:00',
    status: 'graded',
    score: 47,
    comment: '默写正确，作文写得很真实，继续加油！',
    gradedAt: '2024-12-19T09:00:00',
    gradedBy: '李华老师',
    annotations: [],
    isLate: false
  }
];

// 通知数据
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 's1',
    userRole: 'student',
    type: 'assignment_published',
    title: '新作业发布',
    content: '王明老师发布了新作业：长方形和正方形周长 专项练习',
    relatedId: 'a2',
    relatedType: 'assignment',
    read: false,
    createdAt: '2024-12-18T09:05:00'
  },
  {
    id: 'n2',
    userId: 's1',
    userRole: 'student',
    type: 'assignment_graded',
    title: '作业已批改',
    content: '你的作业"第三章 因数与倍数 课后练习"已被批改，得分：58/60',
    relatedId: 'a1',
    relatedType: 'assignment',
    read: false,
    createdAt: '2024-12-19T10:05:00'
  },
  {
    id: 'n3',
    userId: 's1',
    userRole: 'student',
    type: 'reminder',
    title: '作业提醒',
    content: '作业"期末复习综合练习（一）"还有5天截止，请尽快完成。',
    relatedId: 'a4',
    relatedType: 'assignment',
    read: true,
    createdAt: '2024-12-20T08:00:00'
  },
  {
    id: 'n4',
    userId: 't1',
    userRole: 'teacher',
    type: 'system',
    title: '待批改作业提醒',
    content: '你有3份待批改的作业，请及时处理。',
    relatedId: 'a1',
    relatedType: 'assignment',
    read: false,
    createdAt: '2024-12-20T08:00:00'
  },
  {
    id: 'n5',
    userId: 'p1',
    userRole: 'parent',
    type: 'assignment_graded',
    title: '孩子作业已批改',
    content: '张三的作业"第三章 因数与倍数 课后练习"已批改，得分：58/60',
    relatedId: 's1',
    relatedType: 'student',
    read: false,
    createdAt: '2024-12-19T10:10:00'
  }
];

// 统计数据
export const mockStatistics: Statistics = {
  assignmentId: 'a1',
  averageScore: 42,
  highestScore: 59,
  lowestScore: 13,
  submissionRate: 0.75,
  totalStudents: 8,
  submittedCount: 6,
  gradedCount: 3,
  scoreDistribution: [
    { range: '50-60', count: 2 },
    { range: '40-49', count: 0 },
    { range: '30-39', count: 1 },
    { range: '20-29', count: 0 },
    { range: '0-19', count: 1 }
  ],
  knowledgePointStats: [
    { name: '质数与合数', accuracy: 0.75, errorCount: 2 },
    { name: '长方形周长', accuracy: 0.5, errorCount: 3 },
    { name: '平方根', accuracy: 0.75, errorCount: 2 },
    { name: '乘法运算律', accuracy: 0.67, errorCount: 2 },
    { name: '数学应用', accuracy: 0.83, errorCount: 1 }
  ]
};

// 学生作业统计
export const mockStudentStats: StudentAssignmentStats = {
  studentId: 's1',
  totalAssignments: 5,
  completedCount: 4,
  averageScore: 72.5,
  submissionRate: 0.8,
  recentScores: [
    { assignmentId: 'a1', title: '因数与倍数练习', score: 58, totalScore: 60, date: '2024-12-19' },
    { assignmentId: 'a2', title: '周长专项练习', score: 85, totalScore: 100, date: '2024-12-21' },
    { assignmentId: 'a3', title: '静夜思默写', score: 47, totalScore: 50, date: '2024-12-19' },
    { assignmentId: 'a5', title: '乘法运算律预习', score: 42, totalScore: 50, date: '2024-12-10' }
  ]
};

// 趋势数据
export const mockTrendData = [
  { date: '第1周', 平均分: 65, 提交率: 85 },
  { date: '第2周', 平均分: 70, 提交率: 88 },
  { date: '第3周', 平均分: 68, 提交率: 82 },
  { date: '第4周', 平均分: 75, 提交率: 90 },
  { date: '第5周', 平均分: 72, 提交率: 87 },
  { date: '第6周', 平均分: 78, 提交率: 92 },
  { date: '第7周', 平均分: 82, 提交率: 95 },
  { date: '第8周', 平均分: 79, 提交率: 93 }
];
