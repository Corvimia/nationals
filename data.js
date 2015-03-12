/* This file is an API that will be used between Firebase and Front-end */

// private API
(function (){
    
    stored_data = {
        student    : [],
        university : [],
        category   : []
    };
    
    // initialise the connection
    function data___init(){
        
        // create some fake data for now
        students = [{pk: 'sa',name : 'Simon Lemoine',university_fk : 'ua',category_fk : 'ca'},{pk: 'sb',name : 'Ben Glover',university_fk : 'ua',category_fk : 'cb'}];
        unis = [{pk: 'ua',name : 'De Montfort University'},{pk: 'ub',name : 'Leicester Uni'}];
        categories = [{pk: 'ca',name : 'High Fantasy'},{pk: 'cb',name : 'Sci Fi'}];
        
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