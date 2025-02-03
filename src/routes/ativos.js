import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ativosRoutes(fastify) {
  // Criar um novo ativo
  fastify.post("/", async (request, reply) => {
    try {
      const { nome, valor, clienteId } = request.body;

      const clienteExiste = await prisma.cliente.findUnique({
        where: { id: Number(clienteId) }
      });

      if (!clienteExiste) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      const ativo = await prisma.ativo.create({ data: { nome, valor, clienteId } });
      return reply.code(201).send(ativo);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao criar ativo", details: error.message });
    }
  });

  // Listar todos os ativos
  fastify.get("/", async (_, reply) => {
    try {
      const ativos = await prisma.ativo.findMany({ include: { cliente: true } });
      return reply.send(ativos);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao buscar ativos", details: error.message });
    }
  });

  // Atualizar um ativo existente
  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const { nome, valor } = request.body;

      const ativoExiste = await prisma.ativo.findUnique({ where: { id: Number(id) } });
      if (!ativoExiste) {
        return reply.status(404).send({ error: "Ativo não encontrado" });
      }

      const ativoAtualizado = await prisma.ativo.update({
        where: { id: Number(id) },
        data: { nome, valor }
      });

      return reply.send(ativoAtualizado);
    } catch (error) {
      reply.status(500).send({ error: "Erro ao atualizar ativo", details: error.message });
    }
  });

  // Deletar um ativo existente
  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      const ativoExiste = await prisma.ativo.findUnique({ where: { id: Number(id) } });
      if (!ativoExiste) {
        return reply.status(404).send({ error: "Ativo não encontrado" });
      }

      await prisma.ativo.delete({ where: { id: Number(id) } });
      return reply.code(204).send();
    } catch (error) {
      reply.status(500).send({ error: "Erro ao excluir ativo", details: error.message });
    }
  });
}
