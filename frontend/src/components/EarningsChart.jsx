// frontend/src/components/EarningsChart.jsx
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function EarningsChart({ data = [] }) {
  // transform rows into chart-friendly format
  const chartData = (data || []).map(r => ({ day: r.day, earnings: Number(r.total_amount) || 0 }));

  return (
    <div style={{ height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip formatter={(val) => `₹${val}`} />
          <CartesianGrid strokeDasharray="3 3" />
          <Area type="monotone" dataKey="earnings" stroke="#2563eb" fill="url(#g)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
