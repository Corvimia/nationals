// window.data.init			  = data___init;
//	  window.data.save			 = data___save;
//	  window.data.get_list		 = data___get_list;
//	  window.data.get_everything = data___get_everything;

(function () {

	data.init('nationals_test_tom');
	create_data();
	get_data('winner');
	
	function create_data(){
		
		var students, unis, categories, winners;
		
		// create some fake data for now
		students = [{name : 'Simon Lemoine',university_name : 'De Montfort University',category_name : 'High Fantasy'},{name : 'Ben Glover',university_name : 'Leicester Uni',category_name : 'Sci Fi'}];
		unis = [{name : 'De Montfort University'},{name : 'Leicester Uni'}];
		categories = [{name : 'High Fantasy'},{name : 'Sci Fi'}];
		
		
		winner = []
		
		data.save('university', unis);
		data.save('category', categories);
		data.save('student', students);
		
	}
	
	function get_data(type){
		
		var list = data.get_list(type);
		
		console.log(JSON.stringify(list, null, 2));
		
	}
	
	
})();
