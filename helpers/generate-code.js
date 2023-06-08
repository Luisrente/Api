
const  generateNumero= () => {
    const min = 0;
    const max = 9999;
    const numero = Math.floor(Math.random() * (max - min + 1)) + min;
    return numero.toString().padStart(4, '0');
  }


  module.exports = {
    generateNumero
}
