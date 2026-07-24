const numbers = ['2', '3', '4','5', '6', '7', '8', '9']
const letters = ['A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y']

export default function generator(){
	let code = ''
	for(let i = 0; i < 6; i++){
		if(i%2==0) code += numbers[Math.floor(Math.random() * numbers.length )]
		else code += letters[Math.floor(Math.random() * letters.length)]
	}
	return code
}
