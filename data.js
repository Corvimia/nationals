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
            if(stored_data[table][i].name.toLowerCase() == table_value.toLowerCase()){
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
            category   : [],
            winner     : [],
            score      : []
        };
        
        // our base firebase URL
        var base_firebase = 'https://luminous-torch-1139.firebaseio.com/';
        
        // our DB access string
        firebase = base_firebase + db_name + '/';
        
        new Firebase(firebase + 'student'   ).on("child_added", function(snapshot){ fb_add_data('student',    snapshot); });
        new Firebase(firebase + 'university').on("child_added", function(snapshot){ fb_add_data('university', snapshot); });
        new Firebase(firebase + 'category'  ).on("child_added", function(snapshot){ fb_add_data('category',   snapshot); });
        new Firebase(firebase + 'winner'    ).on("child_added", function(snapshot){ fb_add_data('winner',     snapshot); });
        new Firebase(firebase + 'score'     ).on("child_added", function(snapshot){ fb_add_data('score',      snapshot); });
        
    }
    
    
    function check_for_duplicate(table, entry, prevent_duplicate_property){

        var list = stored_data[table];

        for(var i = 0; i < list.length; i++){
            if(entry[prevent_duplicate_property] == list[i][prevent_duplicate_property]){
                return true;
            }

        }

        return false;

    }

    
    // PRIVATE
    function replace_name_for_fk(entry){
    
        // go through the list of table
        for(var stored_table in stored_data){
            if(stored_data.hasOwnProperty(stored_table)){
                // check if our entry has a property with is the name of another table
                if(entry[stored_table + '_name'] !== undefined){
                    // get the pk linked to the name
                    var table_value = entry[stored_table + '_name'];
                    var table_fk = get_table_fk(stored_table, table_value);
                    
                    if(table_fk == -1){
                        console.error("Could not save entry because missing table value.",{
                            table: stored_table,
                            incorrect_value: table_value,
                            entry: entry
                        });
                        continue;
                    }
                    
                    delete entry[stored_table + '_name'];
                    entry[stored_table + '_fk'] = table_fk;
                }
            }
        }
        return entry;
    }
    
    // PUBLIC
    // Saves a list of data in a certain format
    //  table: name of the table you want to insert into
    //      i.e: student, university, etc
    //  list: array of js object
    //  return bool if successful
    function data___save(table, list, prevent_duplicate_property){
        
        if(!stored_data[table]){
            return false;
        }

        var data_ref = new Firebase(firebase + table);
        
        // go through the list
        for(var i = 0; i < list.length; i++){

            if(prevent_duplicate_property){

                if(check_for_duplicate(table, list[i], prevent_duplicate_property)){
                    alert("You have already saved this entry. You cannot re-save it. If you have made a mistake, please call The French.");
                    continue;
                }

            }

            // get the next pk
            list[i].pk = get_next_identity(table);
            
            list[i] = replace_name_for_fk(list[i]);
            
            
            // save our entry
            data_ref.push(list[i]);
        }
        
        
        return true;
    }
    
    // PUBLIC
    // create a callback when university get points
    // it will call the function with the new total for the uni
    //  callback : function callback when points are added
    //  return an object
    function data___init_university_total(callback){
        
        new Firebase(firebase + 'score' ).on("child_added", function(snapshot){
            var new_score = snapshot.val();
            
            var score_list = stored_data.score;
            
            var uni_details = {
                university_fk : new_score.university_fk,
                total         : 0
            }
            
            uni_details.university_name = data___get_entry('university', uni_details.university_fk).name;
            
            for(var i = 0; i < score_list.length; i++){
                if(score_list[i].university_fk == new_score.university_fk){
                    uni_details.total += score_list[i].point;
                }
            }
            
            callback.call(window, uni_details);
            
        });
    }
    
    // PUBLIC
    // return an entry with a certain pk
    //  table: name of table you want to get the entry fromCharCode
    //  pk : entry you want to get
    //  return an object
    function data___get_entry(table, pk){
        var list = stored_data[table];
        
        for(var i = 0; i < list.length; i++){
            if(list[i].pk == pk){
                return list[i];
            }
        }
        
        console.error("Could not retrieve " + table + " with pk " + pk);
        
        return null;
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
    window.data.init                  = data___init;
    window.data.init_university_total = data___init_university_total;
    window.data.save                  = data___save;
    window.data.get_list              = data___get_list;
    window.data.get_entry             = data___get_entry;
    window.data.get_everything        = data___get_everything;
    
})();