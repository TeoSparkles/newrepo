// Build inventory items into HTML table components and inject into DOM 
function buildReviewList(data) { 
    let reviewDisplay = document.getElementById("reviewDisplay");

    
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.review_id + ", " + element.review_text); 
     dataTable += `<tr><td>${element.inv_make}</td>`; 
     dataTable += `<td><a href='/inv/edit/${element.review_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/inv/delete/${element.review_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    reviewDisplay.innerHTML = dataTable; 
   }