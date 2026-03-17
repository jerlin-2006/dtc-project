import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

function ClimateChart({ data }) {

  // ✅ DEBUG (check if data is coming)
  console.log("Chart Data:", data);

  // ✅ PREVENT BLANK CHART
  if (!data || data.length === 0) {
    return (
      <div style={{
        width: "100%",
        height: "300px",
        background: "#ffffff",
        borderRadius: "15px",
        padding: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <p>Loading climate data...</p>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      height: "300px",
      background: "#ffffff",
      borderRadius: "15px",
      padding: "10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      marginTop: "20px"
    }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        📊 5-Day Climate Trend
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "10px"
            }}
          />

          {/* 🌡 Temperature Area */}
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#ff7300"
            fill="url(#tempGradient)"
            strokeWidth={3}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ClimateChart;