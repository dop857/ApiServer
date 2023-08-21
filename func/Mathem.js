const {Constant} = require("./Constant");

Mathem=
    {
        float2bin(str)
        {
            var text = str, no, noa = [0], tmp, i, j, k, l, obj = {};

            no = parseFloat(text);
            text = text.toLowerCase();

            obj.TEXT = text;
            obj.sign = ( text.indexOf('-') >= 0 ) ? '-' : '+';
            obj.e = ( text.indexOf('e') >= 0 ) ? 'e' + obj.sign : '';
            obj.TEXT_FLOAT = (obj.e) ? text.split(obj.e)[0] : text;
            obj.TEXT_EXP = (obj.e) ? text.split(obj.e)[1] : '0';
            text = obj.TEXT_FLOAT;
            tmp = text.split('.');
            obj.Num = Math.abs(tmp[0]);
            obj.Dec = (+( '0.' + ((tmp[1]) ? tmp[1] : '0' )));
            obj.Exp = (obj.e) ? parseInt( obj.TEXT.split( obj.e )[1], 10) : 127;
            obj.Exp += (obj.e && obj.sign === "+") ? 127 : 0;
            text = (obj.e) ? text.split(obj.e)[0] : text;

            noa[0] = ( obj.sign === '-' ) ? 1 : 0;

            tmp = obj.Num;
            obj.Num = (obj.Num);
            no = obj.Dec;
            tmp = tmp.toString(2) + '.';
            for ( i = tmp.length; (i < 32 && no > 0); i++ ) {
                no *= 2;
                text = ('' + no).split('.')[0];
                no -= (+text);
                tmp += text;
            }
            j = 0;
            i = tmp.indexOf('.');
            text = tmp;
            l = i;
            if (obj.Num > 0) {
                for (i--, k = i; i > -1; i--) {
                    if (tmp[i] === '1') {
                        k = i;
                    }
                }
                j = (l - 1) - k;
            }
            else {
                for (i++, k = i; i < tmp.length; i++) {
                    if (tmp[i] === '1') {
                        k = i - 1;
                        j = i - l;
                        i = tmp.length;
                    }
                }
                j = -j;
            }

            no = (obj.e) ? 0 : j;
            obj.Exp += no;
            tmp = obj.Exp.toString(2);
            for ( i = 8, j = (tmp.length - 1); i > 0; i--, j-- ) {
                noa[ i ] = ( tmp[ j ] ) ? tmp[j] : '0';
            }

            tmp = text.replace('.', '');
            for ( i = 9, j = k + 1; i < 32; i++, j++ ) {
                noa[i] = (tmp[j]) ? tmp[j] : '0';
            }
            console.log(noa.join(""))
            return noa.join("");
        },
        float2hex(str)
        {
            return this.bin2hex(this.float2bin(str));
        },
        bin2hex(str)
        {
            return parseInt(str, 2).toString(16).toUpperCase();
        },
        decU2hex(str, signed)
        {
            var number = str;

            if (number[0] === "-") {

                number = parseInt(number.substring(1),10);

                if (signed == 16) {
                    number = 65536-number;
                }
                else {
                    if (signed == 32) {
                        number -= 4294967296;
                    }
                }

                //number =- number;

            }
        else {
                number = parseInt(number,10);
            }
            if (signed) {
                return this.pad(number.toString(16).toUpperCase(), signed / 4);
            }
            return number.toString(16).toUpperCase();
        },
        decS2hex(str, signed)
        {
            var number = str;

            if (number[0] === "-") {

                number = parseInt(number.substring(1),10);

                if (signed == 16) {
                    number = 65536-number;
                }
                else {
                    if (signed == 32) {
                        number -= 4294967296;
                    }
                }

                //number =- number;

            }
            else {
                number = parseInt(number,10);
            }
            if (signed) {
                return this.pad(number.toString(16).toUpperCase(), signed / 4);
            }
            return number.toString(16).toUpperCase();
        },
        pad(str, length, padStr, left)
        {
            padStr = padStr || "0";
            while (str.length < length) {
                if (left) {
                    str = str + padStr;
                }
                else {
                    str = padStr + str;
                }
            }
            return str;
        },
        CheckNumberVariableType(number,type)
        {
            result=false;
            if(Constant.typeValue[type].min<=number && Constant.typeValue[type].max>=number)
            {
                result=true;
            }
            return result;
        }

            /*stringDecToHex()
        {

        }*/

    }
exports.Mathem=Mathem;