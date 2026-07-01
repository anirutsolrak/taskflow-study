from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db.supabase import supabase

try:  # o tipo do erro varia conforme a versao do client
    from supabase_auth.errors import AuthApiError
except Exception:  # pragma: no cover
    AuthApiError = Exception  # type: ignore

seguranca = HTTPBearer()

NAO_AUTORIZADO = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Token de autenticação inválido ou expirado",
)


def obter_usuario_atual(credenciais: HTTPAuthorizationCredentials = Depends(seguranca)):
    token = credenciais.credentials
    try:
        response = supabase.auth.get_user(token)
    except AuthApiError:
        # token expirado / assinatura invalida -> 401 em vez de vazar 500
        raise NAO_AUTORIZADO

    usuario = response.user if response else None  # type: ignore
    if usuario is None:
        raise NAO_AUTORIZADO
    return usuario
