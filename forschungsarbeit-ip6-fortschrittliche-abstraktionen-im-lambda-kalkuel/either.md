# Either

## Beschreibung

### Either Type

Der Either Type wird häufig in funktionalen Programmiersprachen wie zum Beispiel Haskell oder Scala eingesetzt für das Error Handling. Der Either Type ist ein polymorpher Typ, der zwei Zustände anehmen kann. Für diese 2 Zustände gibt es die Wert- Konstruktoren **Left** und **Right**. Somit ist ein Either entweder ein Left oder ein Right. Left und Right tragen beide einen Wert mit sich. Left wird verwendet um im Fehlerfall die Fehlermeldung zu kapseln. Right wird verwendet um im Erfolgsfall den korrekten Wert zu kapseln. Durch den Either Type kann so elegant auf Fehler reagiert werden, dies in einer rein funktionalen Sprache,  d.h ohne Seiteneffekte und nur mit reinen Funktionen.

Either Type Implementation:

```javascript
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
```

Left und Right sind zwei Funktionen die jeweils einen Wert und 2 Funktionen entgegen nehmen. Beide Funktionen ignorieren eine der beiden übergebenen Funktionen. Die Left Funktion wendet die linke \(erste übergebene\) Funktion auf den Parameter x an und ignoriert die zweite Funktion. Die Right Funktion wendet die rechte \(zweite übergebene\) Funktion auf den Parameter x an und ignoriert die erste Funktion. Left und Right bilden die Basis für einen weiteren Typ, den [Maybe Type](maybe.md).

Beispiel Anwendung:

## Verwendung

### eitherTruthy

Die **eitherTruthy** Funktion erwartet einen Wert und überprüft ob dieser truthy ist. [Liste mit JavaScript falsy Werten](https://developer.mozilla.org/en-US/docs/Glossary/Falsy). Im Erfolgsfall wird ein Right mit dem Element zurückgegben und im Fehlerfall ein Left mit der entsprechenden Fehlermeldung.

Implementation & Beispiele:

```javascript
const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);
        
        
eitherTruthy(null)
    (error => doSomethingInErrorCase(error))
    (value => doSomethingInSuccessCase(value))
```

### eitherNotNullAndUndefined

Die **eitherNotNullAndUndefined** Funktion erwartet einen Wert und überprüft ob dieser nicht **null** oder **undefined** ist.

```javascript
const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);
```




