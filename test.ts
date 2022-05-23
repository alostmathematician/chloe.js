class Test {
    val: string = 'fuck'
    print() {
        console.log('fuck')
    }
}


const test = new Test()

const proto1 = Object.getPrototypeOf(test)
const proto2 = Test.prototype

console.log(Object.getOwnPropertyNames(proto1))
console.log(Object.getOwnPropertyNames(proto2))

const func: Function = proto2['print']
func.apply(proto2)