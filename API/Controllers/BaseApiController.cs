using Microsoft.AspNetCore.Mvc;
using AutoMapper;
namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // protected readonly IMapper _mapper;
        // public BaseApiController(IMapper mapper)
        // {
        //     _mapper=mapper;
        // }
    }
}