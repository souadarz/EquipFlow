interface StatCardProps {
    label: string;
    value: string;
    delta: string;
    deltaType: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
    icon: string;
    iconBg: string;
    iconColor: string;
}

const deltaColors = {
    success: 'text-green-600',
    info: 'text-blue-600',
    warning: 'text-amber-600',
    danger: 'text-red-500',
    neutral: 'text-textgray',
};

export default function StatCard({
    label, value, delta, deltaType, icon, iconBg, iconColor,
}: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all
      hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/8 duration-200">
            <div className="flex items-center justify-between mb-4">
                <span className="text-textgray text-sm font-medium">{label}</span>
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <span className={`material-icons ${iconColor}`} style={{ fontSize: '20px' }}>
                        {icon}
                    </span>
                </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{value}</div>
            <div className={`text-xs mt-1.5 font-medium ${deltaColors[deltaType]}`}>{delta}</div>
        </div>
    );
}