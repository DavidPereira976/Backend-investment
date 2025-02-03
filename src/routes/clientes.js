import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function clientesRoutes(fastify, options, done) {
  // Criar um novo cliente
  fastify.post("/", async (request, reply) => {
    try {
      const { nome, email, status } = request.body;
      const cliente = await prisma.cliente.create({ data: { nome, email, status } });
      return reply.code(201).send(cliente);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao criar cliente", details: error.message });
    }
  });

  // Listar todos os clientes
  fastify.get("/", async (_, reply) => {
    try {
      const clientes = await prisma.cliente.findMany();
      return reply.send(clientes);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao buscar clientes", details: error.message });
    }
  });

  // Atualizar um cliente existente
  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, email, status } = request.body;

      const clienteExiste = await prisma.cliente.findUnique({
        where: { id: Number(id) },
      });

      if (!clienteExiste) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      const cliente = await prisma.cliente.update({
        where: { id: Number(id) },
        data: { nome, email, status },
      });

      return reply.send(cliente);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao atualizar cliente", details: error.message });
    }
  });

  // Deletar um cliente
  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      const clienteExiste = await prisma.cliente.findUnique({
        where: { id: Number(id) },
      });

      if (!clienteExiste) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      await prisma.cliente.delete({ where: { id: Number(id) } });
      return reply.code(204).send();
    } catch (error) {
      reply.status(500).send({ error: "Erro ao excluir cliente", details: error.message });
    }
  });

  done(); // ⚠️ Importante! Garante que o Fastify reconheça corretamente as rotas.
}

export default clientesRoutes;
