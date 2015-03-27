
(function () {

	
	var Competitor, University;

	University = (function() {
		
		University.prototype.id = -1;
		University.prototype.name = '';
		University.prototype.points = 0;
		
		function University() {
	
		
		}

		return University;

	})();
	
	Competitor = (function() {
		
		Competitor.prototype.name = '';
		Competitor.prototype.id = -1;
		Competitor.prototype.team_name;
		
		function Competitor() {
	
		
		}
		
		Competitor.prototype.find_and_set_name_and_team = function () {
			var competitor_data = data.get_entry('student', this.id)
			
			this.name = competitor_data.name;
			this.team_name = data.get_entry('university', competitor_data.university_fk).name;
			
		};
		
		return Competitor;

	})();
	
	window.University = University;
	window.Competitor = Competitor;
	
})();