# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Fixing the path in COPY — this assumes Dockerfile is in the root
COPY Lushenglish_2.Server/Lushenglish_2.Server.csproj Lushenglish_2.Server/

RUN dotnet restore "Lushenglish_2.Server/Lushenglish_2.Server.csproj"
COPY . .
WORKDIR "/src/Lushenglish_2.Server"
RUN dotnet build "Lushenglish_2.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Lushenglish_2.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Lushenglish_2.Server.dll"]
