FROM mcr.microsoft.com/dotnet/sdk:8.0.202 AS build
WORKDIR /source

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

COPY ToDo.Domain/ToDo.Domain.csproj ToDo.Domain/
COPY ToDo.DbMigrator/ToDo.DbMigrator.csproj ToDo.DbMigrator/

RUN dotnet restore ToDo.DbMigrator/ToDo.DbMigrator.csproj

COPY ToDo.Domain/ ToDo.Domain/
COPY ToDo.DbMigrator/ ToDo.DbMigrator/

RUN dotnet ef migrations bundle -p ToDo.DbMigrator/ToDo.DbMigrator.csproj -o /out/efbundle -v

FROM mcr.microsoft.com/dotnet/runtime:8.0.3
WORKDIR /db-migrator
COPY --from=build /out/efbundle .
COPY ToDo.DbMigrator/appsettings.json .
ENTRYPOINT [ "/db-migrator/efbundle" ]