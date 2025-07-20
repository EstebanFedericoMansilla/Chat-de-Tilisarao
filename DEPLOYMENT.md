# Guía de Despliegue - Chat de Tilisarao

## Preparación para Despliegue en la Nube

Este proyecto ha sido preparado para desplegarse en plataformas de nube como Render, Railway, Heroku, o cualquier plataforma que soporte Node.js y PostgreSQL.

### ✅ Cambios Realizados para Despliegue

1. **Eliminado `docker-compose.yml`** - Ya no se necesita para despliegue en nube
2. **Actualizado `.gitignore`** - Incluye archivos de desarrollo y configuración
3. **Creado `env.example`** - Plantilla para variables de entorno
4. **Actualizado `README.md`** - Instrucciones de despliegue
5. **Creado `Procfile`** - Para compatibilidad con Heroku
6. **Creado `database/init.sql`** - Script de inicialización de BD

### 🔧 Configuración Requerida

#### Variables de Entorno

Configura estas variables en tu plataforma de despliegue:

```bash
PORT=3000                    # Puerto (generalmente configurado automáticamente)
DATABASE_URL=postgresql://username:password@host:port/database_name
```

#### Base de Datos PostgreSQL

1. **Crear base de datos PostgreSQL** en tu proveedor de nube
2. **Ejecutar el script de inicialización**:
   ```sql
   -- Copiar y ejecutar el contenido de database/init.sql
   ```

### 🚀 Pasos para Despliegue

#### 1. Subir a GitHub
```bash
git add .
git commit -m "Preparado para despliegue en nube"
git push origin main
```

#### 2. Conectar a Plataforma de Despliegue

**Render.com:**
- Conectar repositorio de GitHub
- Seleccionar "Web Service"
- Configurar variables de entorno
- Comando de inicio: `npm start`

**Railway:**
- Conectar repositorio de GitHub
- Configurar variables de entorno
- Despliegue automático

**Heroku:**
- Conectar repositorio de GitHub
- Configurar variables en Settings > Config Vars
- Despliegue automático

#### 3. Configurar Base de Datos

1. Crear base de datos PostgreSQL en tu plataforma
2. Obtener la URL de conexión
3. Configurar `DATABASE_URL` en las variables de entorno
4. Ejecutar el script `database/init.sql` en la base de datos

### 🔍 Verificación del Despliegue

1. **Verificar logs** - Revisar que no hay errores de conexión a BD
2. **Probar funcionalidades**:
   - Registro de usuarios
   - Inicio de sesión
   - Envío de mensajes
   - Mensajes privados
3. **Verificar persistencia** - Los mensajes deben guardarse en BD

### 🛠️ Solución de Problemas Comunes

**Error de conexión a base de datos:**
- Verificar `DATABASE_URL` está correctamente configurada
- Asegurar que la base de datos está activa
- Verificar que las tablas existen (ejecutar `init.sql`)

**Error de puerto:**
- La mayoría de plataformas configuran `PORT` automáticamente
- Si no, configurar manualmente en variables de entorno

**Error de dependencias:**
- Verificar que `package.json` está en la raíz del proyecto
- Asegurar que todas las dependencias están listadas

### 📞 Soporte

Si encuentras problemas durante el despliegue:
1. Revisar los logs de la aplicación
2. Verificar la configuración de variables de entorno
3. Confirmar que la base de datos está configurada correctamente 