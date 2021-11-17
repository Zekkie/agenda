function createDateElement(date,dateMS) {
	const wrapper = document.querySelector("#app");

	const element = document.createElement("div");

	element.date = dateMS;
	const textnode = document.createTextNode(date);

	

	const insideElement = document.createElement("div");
	insideElement.appendChild(textnode);

	insideElement.setAttribute("class","insideDate");

	element.appendChild(insideElement);

	element.setAttribute("class","outsideDate");

	const data = JSON.parse(localStorage.getItem(dateMS));

	if(data && data.length > 0) {
		element.appendChild(indicator());
	}

	element.onclick = function() {
		if(!document.querySelector("#datum")) {
			document.querySelector("#sidewindow").classList.add("sidewindowCollapse");
			createDateWindow(this.date);
		}else {
			changeDateWindow(this.date);
		}
		
	}

	wrapper.appendChild(element);
}


function setLocalStorage(date,data) {
	if(!localStorage.getItem(date)) {
		const dateArray = [];

		dateArray.push(data);

		const jsonString = JSON.stringify(dateArray);

		localStorage.setItem(date,jsonString);
	}else {
		const dateArray = JSON.parse(localStorage.getItem(date));

		dateArray.push(data);

		const jsonString = JSON.stringify(dateArray);

		localStorage.setItem(date, jsonString);
	}
}

function changeDateWindow(date) {
	if(document.querySelector("#datum")) {
		document.querySelector("#title h1").innerHTML = constructTitleDate(date);
		document.querySelector("#datum").date = date;
		renderData(date);
	}
} 


function createFormWindow(date) {


	//const date = date;

	const sidewindow = document.querySelector("#sidewindow");
	const itemContainer = document.querySelector("#items");

	const formWrapper = document.createElement("form");
	formWrapper.setAttribute("action","#")

	formWrapper.date = date;

	const form = document.createElement("div");

	form.setAttribute("id","form");

	const textInput = document.createElement("input");
	textInput.setAttribute("type","text");
	const textArea = document.createElement("textarea");
	const button = document.createElement("input");
	button.setAttribute("value","add");
	button.setAttribute("type","submit");

	button.onclick = function() {
		const inputObj = {
			todo: textInput.value,
			description: textArea.value
		};

		const date = document.querySelector("#datum").date

		const dateElements = Array.from(document.querySelectorAll(".outsideDate"));

		const matchedDateElement = dateElements.find((element) => {
			return element.date === date;
		});

		console.log(date);

		if(!matchedDateElement.querySelector(".indicatorWrapper")){
			matchedDateElement.appendChild(indicator());
		};

		if(textInput.value.length > 0 && textArea.value.length > 0) {
			setLocalStorage(date, inputObj);

			itemContainer.appendChild(card(inputObj));

			sidewindow.removeChild(form);
		}else {
			window.alert("You forgot to fill something in");
		}

		
	};

	formWrapper.appendChild(textInput);
	formWrapper.appendChild(textArea);
	formWrapper.appendChild(button);

	form.appendChild(formWrapper);

	sidewindow.appendChild(form);
}

function removeItems() {
	const items = Array.from(document.querySelector("#items").children);
	console.log(items);
	if(items) {
		for(let i = 0; i < items.length; i++) {
			document.querySelector("#items").removeChild(items[i]);
		}
	}
}



function indicator() {
	const indicatorWrapper = document.createElement("div");
	indicatorWrapper.setAttribute("class","indicatorWrapper");
	const indicatorDot = document.createElement("div");
	indicatorDot.setAttribute("class","indicator");

	indicatorWrapper.appendChild(indicatorDot);

	return indicatorWrapper;
}

function renderData(datum) {
	removeItems();
	const data = localStorage.getItem(datum);
	if(data) {
		
		const items = JSON.parse(data);

		const container = document.querySelector("#items");

		

		for(let i = 0; i < items.length; i++) {
			container.appendChild(card(items[i]));
		}
	}
}




function constructTitleDate(date) {


	const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];

	const month = months[new Date(date).getMonth()];

	return `${new Date(date).getDate()} ${month} ${new Date().getFullYear()}`
}

function createDateWindow(date) {


	

	const dateStr = constructTitleDate(date);

	const sidewindow = document.querySelector("#sidewindow");

	const detailWindow = document.createElement("div");

	const dateTitle = document.createElement("h1");
	dateTitle.innerHTML = dateStr;

	detailWindow.date = date;

	const buttonHolder = document.createElement("div");
	const itemHolder = document.createElement("div");

	itemHolder.setAttribute("id","items");

	buttonHolder.setAttribute("id","title");

	detailWindow.setAttribute("id","datum");

	const addBtn = document.createElement("button");

	const closeBtn = document.createElement("button");

	addBtn.setAttribute("id","btnAdd");
	
	closeBtn.setAttribute("id", "btnClose");


	closeBtn.onclick = function() {
		sidewindow.classList.remove("sidewindowCollapse");
		setTimeout(function(){
			sidewindow.removeChild(detailWindow);
		},500)
	}

	addBtn.onclick = function() {
		createFormWindow(date);
	}


	buttonHolder.appendChild(addBtn);
	buttonHolder.appendChild(dateTitle);
	buttonHolder.appendChild(closeBtn)
	detailWindow.appendChild(buttonHolder);
	detailWindow.appendChild(itemHolder);


	sidewindow.appendChild(detailWindow);

	renderData(date);

}


function updateDeleteLocalStorage(array,date) {

	

	const data = JSON.stringify(array);

	localStorage.setItem(date,data);
};

function removeFromArray(index, array) {
	array.splice(index,1);
	return array;
}

function updateIndicator(date) {


	console.log(date);
	const dates = Array.from(document.querySelectorAll(".outsideDate"));

	const matchedElement = dates.find(function(item) {
		return item.date === date;
	});

	const data = JSON.parse(localStorage.getItem(date));

	if(data.length < 1) {
		matchedElement.removeChild(matchedElement.querySelector(".indicatorWrapper"));
	}
}

function card(data) {



	const outerCard = document.createElement("div");
	outerCard.setAttribute("class","card");

	const todo = document.createElement("div");
	const description = document.createElement("div");

	todo.setAttribute("class","todo");
	description.setAttribute("class","description");

	const todoTextnode = document.createTextNode(data.todo);
	const descriptionTextnode = document.createTextNode(data.description);

	todo.appendChild(todoTextnode);
	description.appendChild(descriptionTextnode);

	const deleteBtn = document.createElement("button");
	deleteBtn.setAttribute("class", "deleteBtn");

	const textHolder = document.createElement("div");

	textHolder.setAttribute("class","textWrapper");

	textHolder.appendChild(todo);
	textHolder.appendChild(description);
	outerCard.appendChild(textHolder);
	outerCard.appendChild(deleteBtn);

	deleteBtn.onclick = function() {
		
		

		

		const date = document.querySelector("#items").parentNode.date;

		const items = Array.from(document.querySelector("#items").children);

		const itemIndex = items.indexOf(outerCard);


		const data = JSON.parse(localStorage.getItem(date));


		const newArray = removeFromArray(itemIndex, data);

		updateDeleteLocalStorage(newArray, date);

		updateIndicator(date);

		document.querySelector("#items").removeChild(outerCard);
		
	}.bind(this);

	return outerCard;
}

function createWeekDayElement(day) {
	const wrapper = document.querySelector("#days");

	const element = document.createElement("div");
	const textnode = document.createTextNode(day);

	element.appendChild(textnode);

	wrapper.appendChild(element);
}



for(let i = 0; i < 7; i++) {

	const days = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

	const date = new Date();
	date.setDate(date.getDate() + i);

	const weekday = days[date.getDay()];

	createWeekDayElement(weekday);
}


for(let i = 0; i < 30; i++) {
	const date = new Date();


	date.setDate(date.getDate() + i);

	const dayDateMS = new Date(`${date.getMonth() + 1} ${date.getDate()} ${date.getFullYear()}`).getTime();

	const dateStr =  `${date.getDate()}/${date.getMonth() + 1}`;

	


	createDateElement(dateStr, dayDateMS);
}



//noise stuff

(function() {
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const h = ctx.canvas.height;
	const w = ctx.canvas.width;


	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}


	window.onresize = resize;

	function noise(ctx) {
		const imageData = ctx.createImageData(w,h);

		const buffer32 = new Uint32Array(imageData.data.buffer);

		const length = buffer32.length;

		let i = 0;

		for(; i < length;) {
			buffer32[i++] = ((255 * Math.random())|0) << 24;
		}
		
		ctx.putImageData(imageData, 0, 0);
	};

	noise(ctx);

	
	let toggle = true;

	function loop() {
		 toggle = !toggle;
	    if (toggle) {
	        requestAnimationFrame(loop);
	        return;
	    }
	    noise(ctx);
	    requestAnimationFrame(loop);
	};

	loop();


})();



(function() {

	const container = document.querySelector("#container");

	document.body.onmousemove = function(e) {
		const containerPos = container.getBoundingClientRect();
		const {x, y, width, height} = containerPos;
		const {clientX, clientY} = e;

		const posObject = {
			horizontal:(clientX - x) - (width / 2),
			vertical: (clientY - y) - (height / 2)
		}

		const blur = 20;



		container.style.setProperty('--x',`${(posObject.horizontal * -1) * 0.017}px`);
		container.style.setProperty('--y',`${(posObject.vertical * -1) * 0.017}px`);
		container.style.setProperty('--blur',`${blur}px`)
	}

})()