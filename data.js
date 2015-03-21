/* This file is an API that will be used between Firebase and Front-end */

// private API
(function (){
    
    var stored_data;
    
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
    
    // PRIVATE
    // get the pk of the name
    function get_table_fk(table, table_value){
        for(var i = 0; i < stored_data[table].length; i++){
            if(stored_data[table][i].name == table_value){
                return stored_data[table][i].pk;
            }
        }
        
        return -1;
    }
    
    
    
    
    
    // PUBLIC
    // initialise the connection
    // db_name: the name of your DB
    function data___init(db_name){
        
        if(!db_name){
            alert("You don't have a DB!");
            return;
        }
        
        stored_data = {
            student    : [],
            university : [],
            category   : []
        };
        
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
        
        // go through the list
        for(var i = 0; i < list.length; i++){
            // get the next pk
            list[i].pk = get_next_identity(table);
            
            // go through the list of table
            for(var stored_table in stored_data){
                if(stored_data.hasOwnProperty(stored_table)){
                    // check if our entry has a property with is the name of another table
                    if(list[i][stored_table + '_name'] !== undefined){
                        // get the pk linked to the name
                        var table_value = list[i][stored_table + '_name'];
                        var table_fk = get_table_fk(stored_table, table_value);
                        
                        if(table_fk == -1){
                            console.error("Could not save entry because missing table value");
                            continue;
                        }
                        
                        delete list[i][stored_table + '_name'];
                        list[i][stored_table + '_fk'] = table_fk;
                    }
                }
            }
            
            // save our entry
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