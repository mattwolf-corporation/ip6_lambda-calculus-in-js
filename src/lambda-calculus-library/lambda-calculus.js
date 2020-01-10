export {I as id, M, K, KI, C, B, T, V, Blackbird, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, True, False, not, and, or, beq, showBoolean, convertToJsBool, pair, triple, mapPair, showPair}

/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {function} fn
 * @typedef {function} gn
 * @typedef {function} pn
 * @typedef {function} qn
 * @typedef {function} boolean
 * @typedef {function} pair
 */

/**
 * a -> a ; Identity (id)
 * @param   {a} x
 * @returns {a} the Identity {@link a}
 */
const I = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 * @param {a} x
 * @returns { function(y:b): function(x:{a}) } a function that ignores its argument and returns {@link a}
 */
const K = x => y => x;

/**
 * a -> b -> b ; Kite
 * @param {a} x
 * @returns { function(y:{b}): function(y:{b} } a function that returns its argument {@link a}
 */
const KI = x => y => y;

/**
 * fn -> fn( fn ) ; Mockingbird
 * @param {fn} f
 * @returns { function(f {fn}) } a self-application combinator
 */
const M = f => f(f);

/**
 * fn -> a -> b -> fn( b )( a ) ; Cardinal (flip)
 * @param  {fn} f
 * @returns { function(x:{a}): function(y:{b}): function(fn y:{b} x:{a} ) } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 */
const C = f => x => y => f(y)(x);

/**
 * fn -> gn -> a -> fn( gn( a ) ) ; Bluebird (Function composition)
 * @param {fn} f
 * @returns { function(g:{gn}): function(x:{a}):  function({ fn:{ gn:{a} } } ) } two-fold self-application composition
 *
 * @example
 * B(id)(id)(n7) === n7
 * B(id)(jsnum)(n7) === 7
 * B(not)(not)(True) === True
 */
const B = f => g => x => f(g(x));

/**
 * a -> fn -> fn( a ) ; Thrush (hold an argument)
 * @function T
 * @param {a} x
 * @returns { function(f:{fn}): function(f x:{a} ) } self-application with holden argument
 */
const T = x => f => f(x);

/**
 * a -> b -> fn -> fn(a)(b) ; Vireo (hold pair of args)
 * @param {a} x
 * @returns { function(y:{b}): function(f:{fn}): function(fn x:{a} y:{b} ) }
 */
const V = x => y => f => f(x)(y);

/**
 * fn -> gn -> a -> b -> fn( gn(a)(b) ) ; Blackbird (Function composition with two args)
 * @Typedef {function} Blackbird
 * @param {fn} f
 * @returns { function(g:{gn}): function(x:{a}): function(y:{b}): function({ fn:{ gn x:{a} y:{b}  } }) }
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * a -> b -> b ; {churchBoolean} False Church-Boolean
 * @type {function(a): function(*): {b}}
 */
const False = KI;

/**
 * a -> b -> a ; {churchBoolean} True Church-Boolean
 * @type {K.props|*}
 */
const True = K;


/**
 * fn -> a -> b -> fn( b )( a ) ; not
 * @param {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not(True)      === False;
 * not(False)     === True;
 * not(not(True)) === True;
 * @type {function(fn): function(*=): function(*=): *}
 */
const not = C;

/**
 * pn -> qn -> pn( qn )(False) ; and
 * @param {pn} p
 * @returns { function(q:{qn}): {ChurchBoolean} } True or False
 */
const and = p => q => p(q)(False);


/**
 * pn -> qn -> pn( qn )(False) ; and
 * @param {pn} p
 * @returns { function(q:{qn}): {ChurchBoolean} } True or False
 */
const or = p => q => p(True)(q);

/**
 * pn -> qn -> pn( qn )(not( qn)) ; beq (ChurchBoolean-Equality)
 * @param {pn} p
 * @returns { function(q:{qn}): {ChurchBoolean} } True or False
 */
const beq = p => q => p(q)(not(q));


/**
 * b -> b("True")("False") ; showBoolean
 * @param b {churchBoolean}
 * @return string - "True" or "False"
 * @example
 * showBoolean(True)  === "True";
 * showBoolean(False) === "False";
 */
const showBoolean = b => b("True")("False");

/**
 * b -> b(true)(false) ; convertToJsBool
 * @param b {churchBoolean}
 * @return {boolean} - true or false
 * @example
 * convertToJsBool(True)  === true;
 * convertToJsBool(False) === false;
 */
const convertToJsBool = b => b(true)(false);

/**
 *  a -> b -> fn -> fn(a)(b) ; Pair
 * @param {a} x:  firstOfPair argument of the pair
 * @returns {pair} - returns a function, that store two value
 */
const pair = V;

/**
 * fst ; Get first value of Pair
 * @type {K.props|*}
 * @return pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;


/**
 * snd ; Get second value of Pair
 * @type {function(a): function(*): {b}}
 * @return pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;

/**
 *  a -> b -> -> c -> fn -> fn(a)(b)(c) ; Triple
 * @param {*} x:  firstOfTriple argument of the Triple
 * @returns {function} - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);


const firstOfTriple = x => y => z => x;
const secondOfTriple = x => y => z => y;
const thirdOfTriple = x => y => z => z;

const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));


/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 * @param p {pair}
 * @return string with first and second value
 * @example
 * const testPair = pair('Erster')('Zweiter');
 * showPair(testPair) === 'Erster | Zweiter'
 */
const showPair = p => `${p(fst)} | ${p(snd)}`;


