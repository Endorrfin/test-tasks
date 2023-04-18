/*
TASK
Напишите на чистом JavaScript функцию, принимающую на вход URL и отвечающую следующим требованиям:
- Можно использовать все фичи языка, работающие в последней версии Google Chrome.
- Функция вызывается однократно на пустой странице браузера (пустой тег body).
- В момент вызова функция рисует чёрный квадрат со стороной 100px в левом верхнем углу окна.
- Через секунду после вызова функции квадрат начинает равномерное движение вправо со скоростью 100px в секунду.
- В этот же момент (через секунду после вызова функции) посылается GET-запрос на переданный URL.
- Через две секунды после вызова (то есть через одну секунду после старта движения) квадрат должен остановиться.
- Если на момент остановки квадрата уже известен результат запроса, то в момент остановки (не ранее), квадрат должен изменить цвет.
- Если на момент остановки квадрата запрос еще не завершён, то квадрат всё равно должен остановиться, а цвет поменять как только результат запроса будет известен.
- Изменение цвета происходит в зависимости от содержания ответа. Если сервер ответил "1", то перекрасить квадрат в зелёный, если "0", то в синий.
- Если запрос выполнился неудачно (статус не 200) или вообще не выполнился (сетевая ошибка), то в красный.

URL для debug: https://keev.me/f/slowpoke.php
* */

squareManipulation('https://keev.me/f/slowpoke.php');

function squareManipulation (url) {
  const delay = 1000;
  const colorSet = {
    initial: 'black',
    one: 'green',
    zero: 'blue',
    wrong: 'red'
  };

  createSquare();
  executionOrder(delay);

  function createSquare () {
    const element = document.createElement('div');
    element.id = 'square';
    element.style.height = '100px';
    element.style.width = '100px';
    element.style.backgroundColor = 'black';
    element.style.position = 'fixed';
    element.style.top = '0px';
    element.style.left = '0px';
    document.body.appendChild(element);
  };

  function offsetSquare () {
    const square = document.getElementById('square');
    square.style.left = parseInt(square.style.left) + 100 + 'px';
  }

  async function getApiData () {
    const square = document.getElementById('square');
    try {
      const response = await fetch(url);
      const data = await response.json();
      debugger;
      if (data === 1) {
        square.style.backgroundColor = colorSet.one;
      } else if (data === 0) {
        square.style.backgroundColor = colorSet.zero;
      } else {
        square.style.backgroundColor = colorSet.wrong
      }
    } catch (error) {
      console.log(`${error.message} something went wrong 👎`);
    }
  };

  function executionOrder (delay) {
    const interval1 = setInterval(offsetSquare, delay);
    const interval2 = setInterval(getApiData, delay);
    const promise1 = Promise.resolve(interval1);
    const promise2 = Promise.resolve(interval2);

    Promise.all([promise1, promise2]).then((values) => {
      for (let value of values) {
        setTimeout(() => {
          clearInterval(value);
        }, delay)
      }
    })
  }

};
