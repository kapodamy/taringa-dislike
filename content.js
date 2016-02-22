const serverURL = 'http://glacial-cove-76906.herokuapp.com';

function getVotes(shoutId,cb){
	$.get(serverURL+'/get-votes?shout_id='+shoutId,function(res,status){
		return cb(res,status);
	});
}

function renderButtons(){
	if(window.location.pathname ==='/mi'){
		$('.shout-footer > .s-action-list').each(function(){
			var shoutId = $(this).attr('data-id').trim();
			var self = this;
			getVotes(shoutId,function(res,status){
				var button = $(
					`<div class="button-action-s pointer no-me-gusta" title="No me gusta">
						<div class="action-number"> 
							${res?'<span class="like_count">'+res.count+'</span>': '<span class="like_count"> 0 </span>' } 
						</div>
						<i class="icon-pulgarabajo"></i>
					</div>`)
				var test = $(self).children('.action-vote').before(button);
				button.on('click', function(){
					var likes = parseInt(button.find('span.like_count').text());
					button.find('span.like_count').text(likes+1);
					vote(shoutId);
				});
			});		
		})	
	}else{
		$('.list-main-actions').each(function(){
			var self = this;
			var shoutId = $('.shout-action-like').attr('data-id').trim();
			getVotes(shoutId,function(res,status){
				var button = $(
				`<li>
					<a href="#" class="icon-pulgarabajo no-me-gusta" title="Votá negativo a este shout">
						<span class="like_count">
						${res?res.count:'0'}
						</span>
					</a>
				</li>`);
				$(self).append(button);
				button.on('click', function(event,asd){
					var likes = parseInt(button.find('span.like_count').text());
					button.find('span.like_count').text(likes+1);
					vote(shoutId);
				});
			});
		})	
	}
}

function vote(shoutId){

	var avatarUrl = '';
	var user_id = '';
	var nick = $('.user-name').text().trim();

	$.get('http://api.taringa.net/user/nick/view/'+nick,function(res,status){
		user_id = res.id;
		avatarUrl=res.avatar? res.avatar.medium:'';
		$.post(serverURL+'/vote',{
			shout_id:shoutId,
			avatarUrl:avatarUrl,
			nick:nick,
			user_id:user_id
		},function(res,status){
			console.log(res,status);
		});		
	})
}

$(document).ready(function(){
	renderButtons();
});


