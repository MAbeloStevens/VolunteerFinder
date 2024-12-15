

(function ($) {  

  $('#searchForm').submit((event) =>{
    event.preventDefault();
    $('#errorDiv').hidden = true;
    // clear previous results if any
    $('#searchResults').children().not('#noResults').remove();

    try {
      // validate searchTxt
      let searchTxt = $('#searchInput').val().trim();
      if (typeof searchTxt !== 'string') throw 'Search text must be a string';

      let tags = $('select[name="tags"]').val();
      let anyOrAll = $('input[name="anyOrAll"]:checked').val()

      // construct req.body
      let dataBody = {
        searchTxt: searchTxt,
        tags: tags,
        anyOrAll: anyOrAll
      };
      
      // make ajax request
      const requestConfig = {
        method: "POST",
        url: "/api/search",
        data: dataBody
      };
      $.ajax(requestConfig).then(function (response) {
        function getFirstFewTagsAsString(tags) {
          let result = '';
          for (let i = 0; i < tags.length; i++) {
            if (i > 3){
              result += '...';
              break;
            } else if (i == tags.length-1) {
              result += tags[i];
            } else {
              result += tags[i] + '   ';
            }
          }
        };

        searchResultsList = response.searchResults;
        if (searchResultsList.length > 0) {
          $('#noResults').hide();
          for(let result of searchResultsList){
            let firstFewTags = '';
            let i = 0;
            for (let tag of result.tags){
              if (i >= 3){
                firstFewTags += '...';
                break;
              } else if (i == Object.keys(result.tags).length-1) {
                firstFewTags += tag;
              } else {
                firstFewTags += `${tag}, `;
              }
              i++;
            }
            let newResultElement = $(
              `<a href="/organizations/${result.o_id}"><div class="resultDiv"><p class="resultContent">${result.name}</p><div class="resultContent"><label>Tags:</label><p>${firstFewTags}</p></div><p class="resultContent">${result.interestCount} interested</p></div></a>`
            );
            $('#searchResults').append(newResultElement);
          }
        } else {
          $('#noResults').show();
        }
      });

    } catch (e) {
      $('#errorDiv').hidden = false;
      $('#errorMessage').innerText = e;
    }
  });
})(window.jQuery);