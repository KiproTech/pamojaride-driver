const EarningsSummaryCards = ({ trips }) => {
  const now = new Date();

  const todayEarnings = trips.reduce((acc, t) => {
    const tripDate = new Date(t.date);
    return tripDate.toDateString() === now.toDateString() ? acc + t.amount : acc;
  }, 0);

  const weekEarnings = trips.reduce((acc, t) => {
    const tripDate = new Date(t.date);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    return tripDate >= startOfWeek && tripDate <= endOfWeek ? acc + t.amount : acc;
  }, 0);

  const monthEarnings = trips.reduce((acc, t) => {
    const tripDate = new Date(t.date);
    return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear()
      ? acc + t.amount
      : acc;
  }, 0);

  const totalEarnings = trips.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="earnings-cards">
      <div className="card">Today: KES {todayEarnings}</div>
      <div className="card">This Week: KES {weekEarnings}</div>
      <div className="card">This Month: KES {monthEarnings}</div>
      <div className="card">Total: KES {totalEarnings}</div>
    </div>
  );
};

export default EarningsSummaryCards;