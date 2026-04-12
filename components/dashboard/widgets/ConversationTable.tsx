interface Conversation {
  _id: string;
  title?: string;
  createdAt?: string;
}

interface Props {
  label: string;
  conversations: Conversation[];
}

export default function ConversationTable({ label, conversations }: Props) {
  const recent = conversations.slice(0, 8);
  return (
    <div className="md:col-span-3 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-800">{label}</h3>
      </div>
      {recent.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-gray-400">
          No conversations yet
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-5 py-3 text-left font-medium">Title</th>
              <th className="px-5 py-3 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recent.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-700 truncate max-w-xs">
                  {c.title || 'New conversation'}
                </td>
                <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
