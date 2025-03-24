# Proyecto Reto

Aplicación de agendamiento de cita médica para asegurados

## Diagrama de arquitectura

![Example Image](./diagram.png)

### Payload para las tabla DynamoDB

Tiene como key schema la variable apptId. Esta variable tiene como valores unicos un UUID. Como GSI (Global secundary index) la varibable **insureId** para poder obtener todas las citas relacionadas a esta variable.

```json
{
  "apptId": "string",
  "insureId": 0,
  "scheduleId": "string",
  "countryISO": "string",
  "status": "string"
}
```
### Payload para las tablas SQL

Se considera que ambas tablas se encuentran en una misma base de datos y tiene lambdas separadas **appointment_cl** y **appointment_pe**. Estas lambdas guardan informacion en las tablas **mysql_pe** y **mysql_cl** respectivamente.

```json
{
  "insureId": 0,
  "scheduleId": "string",
  "countryISO": "string",
}
```
### Descripcion de APIs

Cuenta con dos API utilizando metodos POST y GET. El primer endpoint POST se usa para ingresar una nueva cita a la aplicacion y seguir el flujo que se encuentran en el diagrama de arquitectura. El endpoint GET se usa para poder obtener la lista completa de las citas que tengan relacion con la variable **insureId**. Para mas detalle ver la documentacion de las APIs en el archivo **swagger.yml** del proyecto.