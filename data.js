var db = null;
var createdb = function(){
	db = window.openDatabase("mydb","1.0","my database",1024*1024*3);
}
var createtb = function(){
	//db.transaction执行一个事物，可以包括多条SQL语句
	db.transaction(function(tx){
		tx.executeSql(
			"create table notes (nid integer  primary key,title text, note text)"
		// ,[],
		// function(){
		// 	alert('Notes表已经创建！');
		// },
		// function(tx,error){
		// 	alert("Notes表创建失败，错误为："+error.massage);
		// }
		);
	});
}

var inserttb=function(){
	var a=$('#title').val();
	var b=$('#note').val();
	db.transaction(function(tx){
		tx.executeSql("insert into notes(title,note) values(?,?)",
			[a,b],
			function(tx,result){
				$("#title").attr("data-nid",result.insertId);
				freshul();
			},
			function(tx,error){
				alert("数据插入失败！");
			});
	});
}

var freshul=function(){
	// var li="<li data-nid="+nid+">"+title+"</li>";
	// $("#notes_list").append(li);
	db.transaction(function(tx,result){
		tx.executeSql("select * from notes",[],
			function(tx,result){
				$("#notes_list").html("");
				var li_item;
				for(var i=0;i<result.rows.length;i++){
					var title=result.rows.item(i)["title"];
					var nid=result.rows.item(i)["nid"];
					li_item="<li data-nid="+nid+">"+title+"</li>";
					$("#notes_list").append(li_item);
				}
			},
			function(){

			});
	});
}

var getlist=function(nid){
	db.transaction(function(tx){
		tx.executeSql("select * from notes where nid=?",[nid],
			function(tx,result){
				if(result.rows.length !=0){
					$("#title").val(result.rows.item(0)["title"])
					$("#title").attr("data-nid",result.rows.item(0)["nid"]);
					$("#note").val(result.rows.item(0)["note"]);
				}
			},
			function(){}
		);
	});
}

var updatetb=function(){
	var title = $("#title").val();
	var note = $("#note").val();
	var nid=title.attr("data-nid");
	db.transcation(function(tx){
		tx.executeSql("update notes set title=?, note=? where nid=?",[title,note,nid],
			function(tx,result){
				freshul();
				alert("记录"+nid+"已更新！");
			},
			function(){
				alert("修改数据失败");
			}
		);
	});
}//更新记录

var deletetb=function(nid){
	db.transaction(function(tx){
		tx.executeSql("delete from notes where nid=?",[nid],
			function(tx,result){
				$("#title").val("").removeAttr("data-nid");
				$("#note").val("");
			},
			function(){
				alert("删除数据失败");
			}
		);
	});
}//删除记录

//获取指定记录
	/*var loadNote=function(title){
		db.transaction(function(tx){
		tx.executeSql("select * from notes where title=?",[title],
			function(tx,result){
					var row=result.rows.item(0);
					$('#title').val(row['title']);
					$('#title').attr("data-nid",row["nid"]);
					$('#note').val(row['note']);
					$('#delete_button').show();
			});
		});
	}*/

$(function(){
	createdb();
	createtb();
	freshul();
	$('#delete_button').hide();
	$('#save_button').click(function(){
		var nid=$("#title").attr("data-nid");
		if(nid!=null){
			updatetb();
		}else{
			inserttb();
		}
	});

	$("#notes_list li").live("click",function(){
		$("#delete_button").show();
		var nid = $(this).attr("data-nid");
		getlist(nid);
	});

	$('#delete_button').click(function(event){
		event.preventDefault();
		var nid=$("#title").attr("data-nid");
		deletetb(nid);
		freshul();
	});

	$("#new_button").click(function(){
		$("#title").val("").removeAttr("data-nid");
		$("#note").val("");
		$("#delete_button").hide();
	});
});