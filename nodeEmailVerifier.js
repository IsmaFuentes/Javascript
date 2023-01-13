const net = require('net');
const dns = require('dns');

/**
 * Utilidades de verificación de emails
 *
 * código fuente: https://github.com/eliashussary/mail-confirm/blob/master/src/index.js
 * @param {{ emailAddress: String, emailFrom: String }} param0
 * @returns
 */
const EmailVerifier = function ({ emailAddress, emailFrom }) {
  /**
   * Recupera los registros MX
   * @param {String} hostname
   * @returns {Array<dns.MxRecord>}
   */
  const resolveMx = async (hostname) => {
    return await new Promise((resolve, reject) => {
      dns.resolveMx(hostname, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  };

  /**
   * Ejecuta varios comandos SMTP (HELO, MAIL FROM & RCPT TO) para asegurar que la dirección de correo introducida es válida.
   *
   * Att: Es posible que el último check no pase porque algunos proveedores de correo sulen deshabilitar el comando RCPT.
   * @param {String} emailAddress
   * @param {String} emailFrom
   * @param {Array<dns.MxRecord>} records
   * @param {Number} timeout
   * @returns {Promise<Array<{ command: String, message: String, status: Number }>>}
   */
  const resolveMailbox = async (emailAddress, emailFrom, records, timeout) => {
    return await new Promise((resolve, reject) => {
      const host = records[0].exchange;
      const commands = [
        `HELO ${host}`,
        `MAIL FROM: <${emailFrom}>`,
        `RCPT TO: <${emailAddress}>`,
      ];

      const smtp = net.createConnection({ port: 25, host });
      const messages = [];

      let step = 0;
      smtp.setEncoding('ascii');
      smtp.setTimeout(timeout);
      smtp.on('next', () => {
        if (step < commands.length - 1) {
          smtp.write(commands[step] + '\r\n');
          step++;
        } else {
          smtp.end(() => resolve(messages));
        }
      });

      smtp.on('data', (data) => {
        const status = parseInt(data.substring(0, 3));
        messages.push({
          command: commands[step],
          message: data,
          status,
        });

        if (status > 200) {
          smtp.emit('next');
        }
      });

      smtp.on('error', (err) => reject(err));
    });
  };

  return {
    /**
     * Verifica
     * @param {*} timeout
     * @returns
     */
    verify: async (timeout = 2000) => {
      try {
        const records = await resolveMx(emailAddress.split('@')[1]);
        const results = await resolveMailbox(emailAddress, emailFrom, records, timeout);

        const response = {
          success: results.every((s) => s.status < 300 && s.status > 200),
          steps: [],
        };

        results.forEach((res) => {
          response.steps.push({
            command: res.command.split(' ')[0],
            resolve: res.status < 300 && res.status > 200,
            message: res.message,
          });
        });

        return response;
      } catch (err) {
        return { success: false, steps: [] };
      }
    },
  };
};

module.exports = { EmailVerifier };
