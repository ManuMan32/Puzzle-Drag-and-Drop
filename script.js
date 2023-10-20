"use strict";

// ---- Variables ----

const piecesBox = document.getElementById("piecesBox");
const piecesNumber = 18;
let pieces;

// ---- Creation of the puzzle ----

function sortPieces(number) {
	const deckPieces = [];
	let j = 1;
	while (j < number+1) {
		deckPieces[j] = 0;
		j++;
	}

	j = 1;
	while (j < number+1) {
		createPiece(Math.floor(Math.random()*17+1));
		j++;
	}

	function createPiece(p) {
		if (p > number) createPiece(1);
		else if (deckPieces[p] == 1) createPiece(p+1);
		else {
			const piece = document.createElement("div");
			piece.classList.add("grid-piece");
			piece.id = getPieceId();
			const img = document.createElement("img");
			img.alt = p;
			img.src = "Pieces/"+p+".png";
			piece.appendChild(img);
			piecesBox.appendChild(piece);
			deckPieces[p] = 1;
		}
	}
}

function getPieceId() {
	while(true) {
		const id = Math.floor(Math.random()*9999)+1;
		if (document.getElementById("Piece"+id) === null) {
			return "Piece"+id;
		}
	}
}

function removePieces() {
	pieces.forEach(i=> i.style.animation = "1s ease forwards disapear" );
	setTimeout(()=>{
		pieces.forEach(i=>i.remove());
	},1300);
}

sortPieces(piecesNumber);
pieces = document.querySelectorAll(".grid-piece");

// --- Drag and drop actions ----

function dragstartFunction(e) {
	this.style.opacity = "0.5";
	if (this.children.length == 1) {
		e.dataTransfer.clearData();
		e.dataTransfer.setData("text",this.id);
	}
}
function dragoverFunction(e) { e.preventDefault(); };
function dropFunction(e) {
	e.preventDefault();
	const data = e.dataTransfer.getData("text");
	if (data.length != 2) {
		const element = document.getElementById(data);
		if (this.children.length == 0) this.appendChild(element.children[0]);
		else if (this.children.length == 1) {
			this.appendChild(element.children[0]);
			element.appendChild(this.children[0]);
			element.style.opacity = "1";
		}
		comprobateComplete();
	}
}

function callEvents() {
	pieces.forEach(i=>{
		i.addEventListener("dragstart",dragstartFunction);
		i.addEventListener("dragend",function() { this.style.opacity = "1"; });
		i.addEventListener("dragover",dragoverFunction);
		i.addEventListener("drop",dropFunction);
	});
}

function removeEvents() {
	pieces.forEach(i=>{
		i.removeEventListener("dragstart",dragstartFunction);
		i.removeEventListener("dragover",dragoverFunction);
		i.removeEventListener("drop",dropFunction);
	});
}

callEvents();

// ---- Various functions ----

function comprobateComplete() {
	const piecesList = document.querySelectorAll(".grid-piece");
	for (let i in piecesList) {
		if (piecesList[i].children[0].alt == parseInt(i)+1) {
			if (i == 17) {
				makeAnimationPieces();
				break;
			}
		} else break;
	}
}

function makeAnimationPieces() {
	const piecesList = document.querySelectorAll(".grid-piece");
	for (let i in piecesList) {
		if (typeof piecesList[i] == "object") {
			removeEvents();
			setTimeout(()=>{
				piecesList[i].style.animation = "2s ease-in-out forwards upPiece";
			},100*i);
		}
	}
	setTimeout(()=>{
		removePieces();
		setTimeout(()=>{
			sortPieces(piecesNumber);
			pieces = document.querySelectorAll(".grid-piece");
			callEvents();
		},1300);
	},3100);
}