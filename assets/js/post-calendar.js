(() => {
  const calendar = document.querySelector('[data-post-calendar]');
  if (!calendar) return;

  const posts = JSON.parse(calendar.querySelector('[data-calendar-posts]').textContent);
  const controls = calendar.querySelector('.calendar-controls');
  const title = calendar.querySelector('[data-month-title]');
  const grid = calendar.querySelector('[data-calendar-grid]');
  const dayPosts = calendar.querySelector('[data-day-posts]');
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byDate = new Map();
  posts.forEach((post) => {
    if (!byDate.has(post.date)) byDate.set(post.date, []);
    byDate.get(post.date).push(post);
  });

  let month;
  if (posts.length) {
    const [year, number] = posts[0].date.split('-').map(Number);
    month = new Date(year, number - 1, 1);
  } else {
    const now = new Date();
    month = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  function render() {
    title.textContent = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const table = document.createElement('table');
    table.className = 'calendar-table';
    const caption = document.createElement('caption');
    caption.textContent = 'Days of the month';
    table.append(caption);
    const head = document.createElement('thead');
    const headingRow = document.createElement('tr');
    weekdays.forEach((day) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = day.slice(0, 2);
      th.setAttribute('aria-label', day);
      headingRow.append(th);
    });
    head.append(headingRow);
    table.append(head);
    const body = document.createElement('tbody');
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    let row = document.createElement('tr');
    for (let offset = 0; offset < firstDay; offset += 1) row.append(document.createElement('td'));
    for (let day = 1; day <= daysInMonth; day += 1) {
      if ((firstDay + day - 1) % 7 === 0 && day > 1) {
        body.append(row);
        row = document.createElement('tr');
      }
      const cell = document.createElement('td');
      const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (byDate.has(date)) {
        const link = document.createElement('a');
        link.href = `#calendar-day-${date}`;
        link.textContent = String(day);
        link.setAttribute('aria-label', `${date}, ${byDate.get(date).length} post${byDate.get(date).length === 1 ? '' : 's'}`);
        cell.append(link);
      } else {
        cell.textContent = String(day);
      }
      const now = new Date();
      if (date === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`) cell.classList.add('current-day');
      row.append(cell);
    }
    while (row.children.length < 7) row.append(document.createElement('td'));
    body.append(row);
    table.append(body);
    grid.replaceChildren(table);

    dayPosts.replaceChildren();
    posts.filter((post) => post.date.startsWith(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-`))
      .reduce((dates, post) => dates.add(post.date), new Set())
      .forEach((date) => {
        const section = document.createElement('section');
        section.id = `calendar-day-${date}`;
        const heading = document.createElement('h4');
        heading.textContent = date;
        section.append(heading);
        const list = document.createElement('ul');
        byDate.get(date).forEach((post) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = post.url;
          link.textContent = post.title;
          item.append(link);
          list.append(item);
        });
        section.append(list);
        dayPosts.append(section);
      });
  }

  controls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-month-change]');
    if (!button) return;
    month = new Date(month.getFullYear(), month.getMonth() + Number(button.dataset.monthChange), 1);
    render();
  });
  render();
  controls.hidden = false;
})();
