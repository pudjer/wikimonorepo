import mutationApi, { ArticleResultDTO, CreateArticleDto } from "../api/mutationApi";

export const seedMathDAG = async (): Promise<ArticleResultDTO[]> => {

  const created: ArticleResultDTO[] = [];
  const ids: Record<string, string> = {};

  const graph = [
    {
      key: "imaginary-unit",
      title: "Мнимая единица",
      content: "Мнимая единица i задаёт корень из -1 и используется в комплексных числах.",
      parents: [],
    },
    {
      key: "differential",
      title: "Дифференциал",
      content: "Дифференциал описывает бесконечно малое изменение функции и является основой для производных.",
      parents: ["imaginary-unit"],
    },
    {
      key: "integral",
      title: "Интеграл",
      content: "Интеграл вычисляет площадь под кривой и тесно связан с дифференциалом через основную теорему анализа.",
      parents: ["differential"],
    },
    {
      key: "calculus",
      title: "Математический анализ",
      content: "Математический анализ объединяет дифференциальное и интегральное исчисление.",
      parents: ["differential"],
    },
    {
      key: "optimization",
      title: "Оптимизация",
      content: "Оптимизация ищет лучшие решения и часто опирается на методы анализа, в том числе на градиентный спуск.",
      parents: ["calculus", "differential"],
    },
    {
      key: "gradient-descent",
      title: "Градиентный спуск",
      content: "Градиентный спуск использует дифференциалы и вычисление градиента для шаговой оптимизации функции.",
      parents: ["optimization", "calculus", "differential"],
    },
    {
      key: "complex-analysis",
      title: "Комплексный анализ",
      content: "Комплексный анализ изучает функции комплексной переменной и активно использует мнимую единицу.",
      parents: ["imaginary-unit"],
    },
    {
      key: "laplace-transform",
      title: "Преобразование Лапласа",
      content: "Преобразование Лапласа переводит функцию во временной области в комплексную область и использует интегралы и мнимую единицу.",
      parents: ["integral", "imaginary-unit", "complex-analysis"],
    },
    {
      key: "fourier-transform",
      title: "Преобразование Фурье",
      content: "Преобразование Фурье разлагает функцию на волны и также опирается на интегралы и комплексные числа.",
      parents: ["integral", "imaginary-unit"],
    },
  ];

  for (const item of graph) {
    const dto: CreateArticleDto = {
      title: item.title,
      content: item.content,
      links: item.parents.map((parentKey) => ({
        name: "extends",
        parent: ids[parentKey],
      })),
    };

    const article = await mutationApi.private.articles.create(dto);
    ids[item.key] = article.id;
    created.push(article);
  }

  return created;
}