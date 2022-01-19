// index.js executes functions when the page is loaded

const indexModule = (() => {
  // add an event listener that occurs when you click the search button
  document.getElementById('search-btn').addEventListener('click', () => {
    return searchModule.searchUsers();
  });

  // execute fetchAllUsers method that usersModule has
  return usersModule.fetchAllUsers();
})();
