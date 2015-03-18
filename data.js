/* This file is an API that will be used between Firebase and Front-end */

// private API
(function (){
    
    stored_data = {
        student    : [],
        university : [],
        category   : []
    };
    
    var firebase;
    
    // initialise the connection
    function data___init(){
        
        firebase = new Firebase('https://luminous-torch-1139.firebaseio.com/nationals_testing/');
        
        // create some fake data for now
        students = [{pk: 11,name : 'Simon Lemoine',university_fk : 21,category_fk : 32},{pk: 12,name : 'Ben Glover',university_fk : 22,category_fk : 31}];
        unis = [{pk: 21,name : 'De Montfort University'},{pk: 22,name : 'Leicester Uni'}];
        categories = [{pk: 31,name : 'High Fantasy'},{pk: 32, name : 'Sci Fi'}];
        
        stored_data.student = students;
        stored_data.university = unis;
        stored_data.category = categories;
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
        
        for(var i = 0; i < list.length; i++){
            stored_data[type].push(list[i]);
        }
        
        return true;
    }
    
    // lost the list of a certain type
    //  type: string that show the data "type"
    //  return an array of object
    function data___get_list(type){
        
        return stored_data[type];
    }
    
    
    window.data = {};
    window.data.init     = data___init;
    window.data.save     = data___save;
    window.data.get_list = data___get_list;
    
})();