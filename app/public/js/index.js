// index.js executes functions when the page is loaded

const indexModule = (() => {
  // get a current path
  const path = window.location.pathname;

  switch (path) {
    case '/':
      // add an event listener that occurs when you click the search button
      document.getElementById('search-btn').addEventListener('click', () => {
        return searchModule.searchUsers();
      });

      // execute fetchAllUsers method that usersModule has
      return usersModule.fetchAllUsers();

    case '/create.html':
      // add an event listener that occurs when you click the save button
      document.getElementById('save-btn').addEventListener('click', () => {
        return usersModule.createUsers();
      });

      // add an event listener that occurs when you click the cancel button
      document.getElementById('cancel-btn').addEventListener('click', () => {
        return (window.location.href = '/');
      });
      break;

    default:
      break;
  }
})();
