from pydantic import BaseModel

class CriarTarefa(BaseModel):
    titulo: str
    concluida: bool = False
    tag: str | None = None

class AtualizarTarefa(BaseModel):
    titulo: str | None = None
    concluida: bool | None = None
    tag: str | None = None
