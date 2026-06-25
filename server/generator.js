const numbers = ['2', '3', '4','6', '7', '8', '9']
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 't', 'w', 'x', 'y', 'z',
'A', 'B', 'D', 'E', 'H', 'Q', 'R', 'T']

export default function generator(){
	let code = ''
	for(let i = 0; i < 6; i++){
		if(i%2==0) code += numbers[Math.floor(Math.random() * numbers.length )]
		else code += letters[Math.floor(Math.random() * letters.length)]
	}
	return code
}
