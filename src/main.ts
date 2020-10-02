import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module'

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
