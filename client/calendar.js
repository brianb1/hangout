Template.calendar.helpers({
	calendarOptions: function () {
		return {
			id: "main-calendar",
			defaultView: "agendaWeek",
			minTime: "07:00:00",
			selectable: true,
			selectHelper: true,
			select: function (start, end) {
				var title = prompt("Where to go?");
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start.toDate(),
						end: end.toDate()
					};
					Meteor.call("addHangout", eventData);
				}
				$("#main-calendar").fullCalendar("unselect");
			},
			editable: true,
			eventDrop: function (event) {
				Meteor.call("moveHangout",
							event.id,
							event.start.toDate(),
							event.end.toDate());
			},
			eventResize: function (event) {
				Meteor.call("moveHangout",
							event.id,
							event.start.toDate(),
							event.end.toDate());
			},
			timezone: "local",
			allDaySlot: false,
			eventClick: function (event) {
				Session.set("selectedEvent", event.id);
			},
			eventColor: "#000000"
		};
	},
	eventSelected: function () {
		return Hangouts.findOne(Session.get("selectedEvent"));
	},
	selectedTitle: function () {
		var selected = Session.get("selectedEvent");
		if (Hangouts.findOne(selected)) {
			return Hangouts.findOne(selected).title;
		} else {
			return "No event selected";
		}
	}
});

Template.calendar.onRendered(function () {
	updateCalendar();
});

function updateCalendar() {
	$("#main-calendar").fullCalendar("removeEvents");
	Hangouts.find().forEach(function (hang) {
		$("#main-calendar").fullCalendar(
			"renderEvent",
			{
				id: hang._id,
				title: hang.title,
				start: moment(hang.start),
				end: moment(hang.end)
			},
			true);
	});
}

Tracker.autorun(updateCalendar);

Template.calendar.events({
	"click .delete": function () {
		Meteor.call("removeHangout", Session.get("selectedEvent"));
	}
});
