# Cloudant Wrapper of Cloudant Node.js Client

A Cloudant wrapper to facilitate use of the official [Cloudant Node.js Module](https://github.com/cloudant/nodejs-cloudant).

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Methods](#methods)
* [License](#license)
* [Reference](#reference)

## Installation

You can me in your package.json dependencies. The `npm` tool can do this for you, from the command line:

    $ npm install --save cloudant-wrapper

### Getting Started

Now it's time to begin doing real work with Cloudant and Node.js.

Initialize your Cloudant connection by supplying your *username* and *password* in the *url* of Cloudant.

~~~ js
// Load the cloudant-wrapper library.
var Cloudant = require('cloudant-wrapper');

// Initialize the library with my account (through URL).
var urlCloudant = "https://USERNAME:PASSWORD@URL";
var nameDB = "my-companies-database";
var options = {'timestamp': true};
var cloudant = Cloudant(urlCloudant, nameDB, options);

// Now, you can call any method of the module
cloudant.create({"name": "IBM Research New York", "location": "New York, USA"}, function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    console.log("Doc created!", result);
  }
});
~~~

### Methods

#### Create

The create method allows insert a new document in database.

~~~ js
cloudant.create(doc, callback)
~~~

* **doc** contains the data to insert in database.
* **callback** a function to return the error or result object (with the doc ID) of the insertion.

Example:

~~~ js
cloudant.create({"name": "IBM Research New York", "location": "New York, USA"}, function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    // Result is an object that contains some information about the insertion like the ID of the doc.
    console.log("Doc created!", result);
  }
});
~~~

#### Update

The update method allows update a document in database from ID.

~~~ js
cloudant.update(id, fields, callback)
~~~

* **id** *id* of the document to modify.
* **fields** contains the data to update in the document identified by the *id* in database.
* **callback** a function to return the error or result object of the modification.

Example:

~~~ js
cloudant.update("ID", {"location": "New Jersey, United States"}, function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    console.log("Doc updated!", result);
  }
});
~~~

#### Delete

The update method allows update a document in database from ID.

~~~ js
cloudant.delete(id, callback)
~~~

* **id** *id* of the document to delete.
* **callback** a function to return the error or *ok* string.

Example:

~~~ js
cloudant.delete("ID", function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    console.log("Doc deleted!");
  }
});
~~~

#### View

The view method allows call a view of the Cloudant database.

~~~ js
cloudant.view(ddocName, viewName, query, callback)
~~~

* **ddocName** Name of the Design Document that contains the Cloudant view.
* **viewName** Name of the View in the Design Document *ddocName*.
* **query** Options to the view (include_docs, group, reduce, etc.).
* **callback** a function to return the error or the result object.

The result object has the next structure:

~~~ json
{
  "total": 4815162342,
  "offset": 0,
  "data":[{}, {}, {}]
}
~~~

Example:

~~~ js
cloudant.view("MyDoc", "myView", {include_docs:true}, function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    console.log("Results:", result);
  }
});
~~~

#### View with List

The viewList method allows call a view of the Cloudant database combined with a list method.

~~~ js
cloudant.viewList(ddocName, viewName, listName, query, callback)
~~~

* **ddocName** Name of the Design Document that contains the Cloudant view.
* **viewName** Name of the View in the Design Document *ddocName*.
* **listName** Name of the List in the Design Document *ddocName* to call after view.
* **query** Options to the view (include_docs, group, reduce, etc.).
* **callback** a function to return the error or the result object.

The result object has the next structure:

~~~ json
{
  "total": 4815162342,
  "data":[{}, {}, {}]
}
~~~

Example:

~~~ js
cloudant.viewList("MyDoc", "myView", "orderByValue", {}, function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    console.log("Results:", result);
  }
});
~~~

#### Search

The search method allows call a Search Index of the Cloudant database.

~~~ js
cloudant.search(ddocName, searchName, query, callback)
~~~

* **ddocName** Name of the Design Document that contains the Cloudant Search Index.
* **searchName** Name of the Search Index in the Design Document *ddocName*.
* **query** Options to the search Index (include_docs, q, limit, bookmark, etc.).
* **callback** a function to return the error or the result object.

The result object has the next structure:

~~~ json
{
  "total": 4815162342,
  "bookmark": "BOOKMARK_STRING",
  "data":[{}, {}, {}]
}
~~~

Example:

~~~ js
cloudant.search("MyDoc", "mySearch", {include_docs:true, q:"name:/.*IBM.*/"}, function(err, result) {
  if (err){
    console.log("An error occurred:", err);
  } else {
    console.log("Results:", result);
  }
});
~~~

## License

MIT License

Copyright (c) 2016 IBM Research Emergent Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Reference

[Cloudant Node.js Module](https://github.com/cloudant/nodejs-cloudant)
[Cloudant Documentation](https://docs.cloudant.com/)
