import Fastify from "fastify";
import dotenv from "dotenv";
import FastifyCors from "@fastify/cors";
import clientesRoutes from "./routes/clientes.js";
import ativosRoutes from "./routes/ativos.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";

const fastify = Fastify({ logger: true });

// Configuração do CORS para permitir requisições do frontend
fastify.register(FastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Rota raiz
fastify.get("/", async (request, reply) => {
  return { message: "API está rodando!" };
});

// Registrando as rotas
fastify.register(clientesRoutes, { prefix: "/clientes" });
fastify.register(ativosRoutes, { prefix: "/ativos" });

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();