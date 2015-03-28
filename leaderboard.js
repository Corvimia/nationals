// window.data.init			  = data___init;
// window.data.save			 = data___save;
// window.data.get_list		 = data___get_list;
// window.data.get_everything = data___get_everything;

(function () {
	new Firebase('https://luminous-torch-1139.firebaseio.com/nationals_test_tom4/score').remove();
	data.init('nationals_test_tom4');
	 
	var space_count = 0, category_list_count = 0;
	var num_categories;
	
	setTimeout(function() {
		populate_leaderboard();
		num_categories = data.get_list('category').length;
		data.init_university_total(uni_callback);
	}, 2000);

	
	
	
	document.onkeypress=function(e){
	 	var e = window.event || e;
		if (e.charCode===32) {
			e.preventDefault();
			space_pressed();
			
		}
	}
	
	//save an object with 
	function uni_callback(uni_details) {
		console.log(uni_details)
		var points_table_rows = toArray(document.querySelectorAll('#points-table tbody tr'));
		var i, index = 0;
		var updated_row = null;
		points_table_rows.forEach(function (row, tmp_index, array) {
			if ($(row).data('uid')===uni_details.university_fk) {
				updated_row = row;
				row.children[1].innerHTML=uni_details.total;
				index = tmp_index;
			}
		});
		
		var row;
		
		for (i=0; i < points_table_rows.length; ++i) {
			row = points_table_rows[i]; 
			if (uni_details.total >= parseInt(row.children[1].innerHTML, 10)) {
				$(updated_row).insertBefore(row);
				return;
			}
		}
		
	}
	
	function space_pressed () {
		var category_section = document.getElementById('category');
		var table_row = null, table_cells = null;
		var space_position = space_count % 4
		
		if(space_count / 4 > num_categories) {
			return;
		}
		
		if (space_position > 0) {
			
			if (space_position > 3) {
				category_list_count++;
				
				
			} else {
				table_row = category_section.querySelector('tbody').children[3-space_position];
				
				push_score_data(table_row);
		
				table_cells = table_row.children
				$(table_cells).animate({opacity: 1}, 500);
			}
		} else {
			if (populate_category()) {
				$(category_section).css('visibility', 'visible').hide().fadeIn();
			}
			
			
		}
		space_count++;
	}
	
	
	function populate_category() {
		var competitor, i, number_names = ['first', 'second', 'third'],
		number_names_2 = ['1st', '2nd', '3rd'],
		points = [6, 3, 1]
		
		var list = data.get_list('winner');
		
		if (category_list_count >= list.length) {
			return false;
		}
		
		var category_id = list[category_list_count].category_fk;
		var category_name = data.get_entry('category', category_id).name;
		
		var competitors = [];
		for (i = 0; i < 3; i++) {
			competitor = new Competitor();
			competitor.id = list[category_list_count][number_names[i]+"_student_fk"];
			competitor.find_and_set_name_and_team();
			competitor.points = points[i];
			competitor.category_id = 
			competitors.push(competitor);
		}
		
		console.log(competitors);
		
		var category_table_body = document.querySelector('#category-table tbody');
		var output_str = '';
		for (i = 0; i < 3; i++) {
			competitor = competitors[i];
			output_str += '<tr><td>'+number_names_2[i]+'</td><td>' + competitor.name + '</td><td>' + competitor.team_name + '</td></tr>';
		}
		
		category_table_body.innerHTML = output_str;
		
		for (i = 0; i < 3; i++) {
			$(category_table_body.children[i]).data('competitor', competitors[i]);
		}
		
		
		document.querySelector('#category h2').innerHTML = category_name + ' Winners';
		category_list_count++;
		
		return true;
	}
	
	function populate_leaderboard() {
		var i, list = data.get_list('university');
		
		console.log(list);
		
		var universities = [];
		for (i = 0; i < list.length; i++) {
			var university = new University();
			university.id = list[i].pk;
			university.name = list[i].name
			universities.push(university);
		}
		
		var points_table_body = document.querySelector('#points-table tbody');
		var output_str = '';
		for (i = 0; i < list.length; i++) {
			university = universities[i];
			output_str += '<tr data-uid="'+university.id+'"><td>' + university.name + '</td><td>' + university.points + '</td></tr>';
		}
		
		points_table_body.innerHTML = output_str;
	}
	
	function push_score_data(table_row) {
		var i, competitor = $(table_row).data('competitor');
		var score = {
			student_fk: competitor.id, 
			university_fk:competitor.university_id,
			category_fk: competitor.category_id,
			rank: competitor.rank,
			point: competitor.points
		};
		
		data.save('score', [score]);
		
	}
	
	
	function get_data(type){
		
		var list = data.get_list(type);
		
		console.log(JSON.stringify(list, null, 2));
		
		console.log(data.get_entry('student', list[0].first_student_fk));
		
	}
	
	
	function toArray(obj) {
	  var array = [];
	  // iterate backwards ensuring that length is an UInt32
	  for (var i = obj.length >>> 0; i--;) { 
	    array[i] = obj[i];
	  }
	  return array;
	}
	
})();
