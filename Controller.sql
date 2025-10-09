

create table Controller
(
	ControllerCode nvarchar(50) primary key
)
create table ControllerAction
(
	ControllerCode nvarchar(50),
	ActionCode nvarchar(50)
)