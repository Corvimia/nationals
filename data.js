/* This file is an API that will be used between Firebase and Front-end */

// private API
(function (){
    
    stored_data = {
        student    : [],
        university : [],
        category   : []
    };
    
    var firebase;
    
    function add_data(type, snapshot){
        stored_data[type].push(snapshot.val());
    }
    
    // initialise the connection
    function data___init(base_folder){
        
        var base_firebase = 'https://luminous-torch-1139.firebaseio.com/';
        
        firebase = base_firebase + base_folder + '/';
        
        new Firebase(firebase + 'student').on("child_added", function(snapshot){ add_data('student', snapshot) });
        
        new Firebase(firebase + 'university').on("child_added", function(snapshot){ add_data('university', snapshot) });
        
        new Firebase(firebase + 'category').on("child_added", function(snapshot){ add_data('category', snapshot) });
        
    }
    
    // Saves a list of data in a certain format
    //  type: a string that show the data type
    //      i.e: student, university, etc
    //  list: array of js object
    //  return bool if successful
    function data___save(type, list){
        
        if(!stored_data[type]){
            return false;
        }
        
        data_ref = new Firebase(firebase + type);
        
        for(var i = 0; i < list.length; i++){
            data_ref.push(list[i]);
        }
        
        
        return true;
    }
    
    // lost the list of a certain type
    //  type: string that show the data "type"
    //  return an array of object
    function data___get_list(type){
        
        return stored_data[type];
    }
    
    function data___get_everything(){
        return stored_data;
    }
    
    
    window.data = {};
    window.data.init     = data___init;
    window.data.save     = data___save;
    window.data.get_list = data___get_list;
    window.data.get_everything = data___get_everything;
    
})();