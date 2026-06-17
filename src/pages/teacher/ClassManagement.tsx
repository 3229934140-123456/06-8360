import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Users,
  Plus,
  QrCode,
  Copy,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Search,
  Download,
  X
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useClassStore } from '@/store/useClassStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate, cn } from '@/utils';

const ClassList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { classes, createClass } = useClassStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [className, setClassName] = useState('');
  const [grade, setGrade] = useState('');

  const myClasses = classes.filter(c => c.teacherId === currentUser?.id || 't1');

  const handleCreate = () => {
    if (!className.trim()) return;
    createClass(className, currentUser?.id || 't1', currentUser?.name || '老师');
    setClassName('');
    setGrade('');
    setShowCreateModal(false);
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Layout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">班级管理</h1>
            <p className="text-neutral-500 mt-1">管理您的班级和学生</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            创建班级
          </button>
        </div>

        {myClasses.length === 0 ? (
          <div className="card py-16 text-center">
            <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">还没有班级</h3>
            <p className="text-neutral-400 mb-6">创建您的第一个班级，开始布置作业吧</p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              创建班级
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myClasses.map(cls => (
              <div
                key={cls.id}
                className="card p-6 cursor-pointer hover:border-primary-300 transition-all group"
                onClick={() => navigate(`/teacher/classes/${cls.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-neutral-800 text-lg">{cls.name}</h3>
                {cls.grade && (
                  <p className="text-sm text-neutral-500 mt-1">{cls.grade}</p>
                )}
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">学生人数</span>
                    <span className="font-medium text-neutral-800">{cls.studentCount} 人</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-neutral-500">创建时间</span>
                    <span className="text-neutral-600">{formatDate(cls.createdAt)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-neutral-50 rounded-lg text-sm text-neutral-600 flex items-center justify-between">
                    <span>邀请码</span>
                    <span className="font-mono font-medium text-primary-600">{cls.inviteCode}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyInviteCode(cls.inviteCode);
                    }}
                    className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="复制邀请码"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowCreateModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">创建新班级</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="input-label">班级名称</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="如：三年级一班"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">年级</label>
                  <select className="input" value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="">请选择年级</option>
                    <option value="一年级">一年级</option>
                    <option value="二年级">二年级</option>
                    <option value="三年级">三年级</option>
                    <option value="四年级">四年级</option>
                    <option value="五年级">五年级</option>
                    <option value="六年级">六年级</option>
                    <option value="七年级">七年级</option>
                    <option value="八年级">八年级</option>
                    <option value="九年级">九年级</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  className="btn btn-primary flex-1"
                  disabled={!className.trim()}
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

const ClassDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getClassById, getStudentsByClassId, removeStudentFromClass } = useClassStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const cls = getClassById(id || '');
  const students = getStudentsByClassId(id || '');

  const filteredStudents = students.filter(s =>
    s.name.includes(searchQuery) || s.studentNo.includes(searchQuery)
  );

  if (!cls) {
    return (
      <Layout role="teacher">
        <div className="text-center py-16">
          <p className="text-neutral-500">班级不存在</p>
          <button onClick={() => navigate('/teacher/classes')} className="btn btn-primary mt-4">
            返回班级列表
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="teacher">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">{cls.name}</h1>
            <p className="text-neutral-500">{cls.studentCount} 名学生 · 邀请码：{cls.inviteCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <p className="text-sm text-neutral-500">学生总数</p>
            <p className="text-2xl font-bold text-neutral-800 mt-1">{students.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-neutral-500">已交作业</p>
            <p className="text-2xl font-bold text-success-600 mt-1">32</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-neutral-500">平均分</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">78.5</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-neutral-500">提交率</p>
            <p className="text-2xl font-bold text-accent-600 mt-1">92%</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold text-neutral-800">学生名单</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索学生..."
                  className="input pl-9 w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowQrModal(true)}
                className="btn btn-secondary"
              >
                <QrCode className="w-4 h-4 mr-1.5" />
                邀请二维码
              </button>
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-1.5" />
                导出
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    学生
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    学号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    加入时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    作业完成率
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full bg-neutral-200"
                        />
                        <span className="font-medium text-neutral-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {student.studentNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {formatDate(student.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-success-500 rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-sm text-neutral-600">85%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => removeStudentFromClass(cls.id, student.id)}
                        className="text-danger-500 hover:text-danger-600 text-sm"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        移除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="py-12 text-center text-neutral-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无学生数据</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQrModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowQrModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-slide-up">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">班级邀请码</h3>
              <p className="text-sm text-neutral-500 mb-4">让学生扫码或输入邀请码加入班级</p>
              <div className="w-48 h-48 bg-neutral-100 rounded-xl mx-auto flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-neutral-400" />
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-neutral-500 mb-1">邀请码</p>
                <p className="text-2xl font-mono font-bold text-primary-600 tracking-wider">
                  {cls.inviteCode}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  关闭
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(cls.inviteCode)}
                  className="btn btn-primary flex-1"
                >
                  <Copy className="w-4 h-4 mr-1.5" />
                  复制邀请码
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export { ClassList, ClassDetail };
