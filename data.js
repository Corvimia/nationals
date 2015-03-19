/* This file is an API that will be used between Firebase and Front-end */

// private API
(function (){
    
    stored_data = {
        student    : [],
        university : [],
        category   : []
    };
    
    var firebase;
    
    // PRIVATE
    // FB
    // insert a snapshot into a table
    function fb_add_data(table, snapshot){
        stored_data[table].push(snapshot.val());
    }
    
    // PRIVATE
    // get the next identity for a table
    function get_next_identity(table){
        var list = stored_data[table];
        
        var max_pk = 0;
        for(var i = 0; i < list.length; i++){
            max_pk = Math.max(max_pk, list[i].pk);
        }
        
        return max_pk + 1;
    }
    
    
    
    
    
    // PUBLIC
    // initialise the connection
    // db_name: the name of your DB
    function data___init(db_name){
        
        if(!db_name){
            alert("You don't have a DB!");
            return;
        }
        
        // our base firebase URL
        var base_firebase = 'https://luminous-torch-1139.firebaseio.com/';
        
        // our DB access string
        firebase = base_firebase + db_name + '/';
        
        // init the student list
        new Firebase(firebase + 'student').on("child_added", function(snapshot){ fb_add_data('student', snapshot) });
        
        // init the university list
        new Firebase(firebase + 'university').on("child_added", function(snapshot){ fb_add_data('university', snapshot) });
        
        // init the category list
        new Firebase(firebase + 'category').on("child_added", function(snapshot){ fb_add_data('category', snapshot) });
        
    }
    
    
    // PUBLIC
    // Saves a list of data in a certain format
    //  table: name of the table you want to insert into
    //      i.e: student, university, etc
    //  list: array of js object
    //  return bool if successful
    function data___save(table, list){
        
        if(!stored_data[table]){
            return false;
        }
        
        data_ref = new Firebase(firebase + table);
        
        for(var i = 0; i < list.length; i++){
            
            list[i].pk = get_next_identity(table);
            
            data_ref.push(list[i]);
        }
        
        
        return true;
    }
    
    
    // PUBLIC
    // return the list of a certain table
    //  table: name of the table you wanna get
    //  return an array of object
    function data___get_list(table){
        return stored_data[table];
    }
    
    
    // PUBLIC
    // get the whole DB
    function data___get_everything(){
        return stored_data;
    }
    
    
    window.data = {};
    window.data.init           = data___init;
    window.data.save           = data___save;
    window.data.get_list       = data___get_list;
    window.data.get_everything = data___get_everything;
    
})();